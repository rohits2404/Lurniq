"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ApiResponse = {
    status: "success" | "error";
    message: string;
};

export const DeleteCourse = async (courseId: string): Promise<ApiResponse> => {
    try {
        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath("/admin/courses");

        return {
            status: "success",
            message: "Course Deleted Successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed To Delete Course",
        };
    }
};
