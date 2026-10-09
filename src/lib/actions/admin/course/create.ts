"use server";

import { courseSchema, CourseSchemaType } from "@/lib/schema";
import { requireAdmin } from "../admin";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

type ApiResponse = {
    status: "success" | "error";
    message: string;
};

export async function CreateCouse(
    values: CourseSchemaType,
): Promise<ApiResponse> {
    const session = await requireAdmin();

    try {
        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        const data = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data: {
                currency: "usd",
                unit_amount: validation.data.price * 100,
            },
        });

        const course = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id,
                stripePriceId: data.default_price as string,
            },
        });

        return {
            status: "success",
            message: `Course "${course.title}" Created Successfully`,
        };
    } catch {
        return {
            status: "error",
            message:
                "Failed To Create The Course. Please Check Server Logs For Details.",
        };
    }
}
