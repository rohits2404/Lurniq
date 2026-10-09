"use server";

import { lessonSchema, LessonSchemaType } from "@/lib/schema";
import { requireAdmin } from "../../admin";
import { prisma } from "@/lib/db";

type ApiResponse = {
    status: "success" | "error";
    message: string;
};

export const updateLesson = async (
    values: LessonSchemaType,
    lessonId: string,
): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid Data",
            };
        }

        await prisma.lesson.update({
            where: {
                id: lessonId,
            },
            data: {
                title: result.data.name,
                description: result.data.description,
                thumbnailKey: result.data.thumbnailKey,
                videoKey: result.data.videoKey,
            },
        });

        return {
            status: "success",
            message: "Lesson Updated Successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed To Update Course",
        };
    }
};
