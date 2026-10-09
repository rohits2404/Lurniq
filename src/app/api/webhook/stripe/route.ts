import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

async function activateEnrollment(session: Stripe.Checkout.Session) {
    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;

    const customerId =
        typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

    if (!courseId || !enrollmentId || !customerId) {
        throw new Error("Missing courseId, enrollmentId, or customerId");
    }

    if (session.payment_status !== "paid") {
        throw new Error(
            `Cannot activate enrollment for unpaid session ${session.id}`,
        );
    }

    if (session.amount_total === null) {
        throw new Error(`Missing amount_total for session ${session.id}`);
    }

    // Find the user associated with this Stripe customer.
    const user = await prisma.user.findUnique({
        where: {
            stripeCustomerId: customerId,
        },
    });

    if (!user) {
        throw new Error(`User not found for Stripe customer ${customerId}`);
    }

    // Verify that the enrollment belongs to this user and course.
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId,
        },
    });

    if (!enrollment) {
        throw new Error(`Enrollment ${enrollmentId} not found`);
    }

    if (enrollment.userId !== user.id || enrollment.courseId !== courseId) {
        throw new Error(`Enrollment ownership mismatch for ${enrollmentId}`);
    }

    // Avoid activating the same enrollment more than once.
    if (enrollment.status === "Active") {
        return;
    }

    if (enrollment.status !== "Pending") {
        throw new Error(`Enrollment ${enrollmentId} is not pending`);
    }

    const result = await prisma.enrollment.updateMany({
        where: {
            id: enrollmentId,
            userId: user.id,
            courseId,
            status: "Pending",
        },
        data: {
            amount: session.amount_total,
            status: "Active",
        },
    });

    if (result.count === 0) {
        // Another webhook delivery may have activated it already.
        const currentEnrollment = await prisma.enrollment.findUnique({
            where: {
                id: enrollmentId,
            },
        });

        if (currentEnrollment?.status === "Active") {
            return;
        }

        throw new Error(`Failed to activate enrollment ${enrollmentId}`);
    }
}

export async function POST(request: Request) {
    // 1. Read the raw request body.
    const body = await request.text();

    // 2. Get Stripe's signature header.
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return new Response("Missing Stripe-Signature header", {
            status: 400,
        });
    }

    // 3. Verify the webhook signature.
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (error) {
        console.error("Stripe signature verification failed:", error);

        return new Response("Invalid webhook signature", {
            status: 400,
        });
    }

    // 4. Process supported events.
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                // Delayed payment methods may complete checkout
                // before the actual payment succeeds.
                if (session.payment_status === "paid") {
                    await activateEnrollment(session);
                }

                break;
            }

            case "checkout.session.async_payment_succeeded": {
                const session = event.data.object as Stripe.Checkout.Session;

                await activateEnrollment(session);
                break;
            }

            case "checkout.session.async_payment_failed": {
                // Keep the enrollment pending here.
                // Handle failed payments separately if required.
                console.warn(
                    "Stripe delayed payment failed:",
                    event.data.object.id,
                );

                break;
            }

            default: {
                // Ignore event types this endpoint doesn't handle.
                break;
            }
        }

        return Response.json({ received: true });
    } catch (error) {
        console.error(`Failed to process Stripe event ${event.id}:`, error);

        // A non-2xx response allows Stripe to retry the event.
        return Response.json(
            { error: "Webhook processing failed" },
            { status: 500 },
        );
    }
}
