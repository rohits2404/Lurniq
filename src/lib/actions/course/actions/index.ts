"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "../../user/user";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { redirect } from "next/navigation";

type ApiResponse = {
    status: "success" | "error";
    message: string;
};

export const enrollInCourseAction = async (
    courseId: string,
): Promise<ApiResponse | never> => {
    const user = await requireUser();

    let checkoutUrl: string;

    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
                stripePriceId: true,
            },
        });

        if (!course) {
            return {
                status: "error",
                message: "Course not found",
            };
        }

        if (!course.stripePriceId) {
            return {
                status: "error",
                message:
                    "This course is not available for purchase at the moment.",
            };
        }

        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        if (userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id,
                },
            });

            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                },
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId,
                    },
                },
                select: {
                    status: true,
                    id: true,
                },
            });

            if (existingEnrollment?.status === "Active") {
                return {
                    status: "success",
                    message: "You are already enrolled in this course",
                };
            }

            let enrollment;
            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amount: course.price,
                        status: "Pending",
                        updatedAt: new Date(),
                    },
                });
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: "Pending",
                    },
                });
            }

            const chekoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: course.stripePriceId,
                        quantity: 1,
                    },
                ],

                mode: "payment",
                success_url: `${process.env.BETTER_AUTH_URL}/payment/success`,
                cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                },
            });

            return {
                enrollment: enrollment,
                checkoutUrl: chekoutSession.url,
            };
        });

        checkoutUrl = result.checkoutUrl as string;
    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: "error",
                message: "Payment system error. Please try again later",
            };
        }
        return {
            status: "error",
            message: "Failed to enroll in course",
        };
    }

    redirect(checkoutUrl);
};
