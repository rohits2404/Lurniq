"use server";

import {
    chapterSchema,
    ChapterSchemaType,
    courseSchema,
    CourseSchemaType,
    lessonSchema,
    LessonSchemaType,
} from "@/lib/schema";
import { requireAdmin } from "../admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ApiResponse = {
    status: "success" | "error";
    message: string;
};

export const editCourse = async (
    data: CourseSchemaType,
    courseId: string,
): Promise<ApiResponse> => {
    const user = await requireAdmin();

    try {
        const result = courseSchema.safeParse(data);

        if (!result.success) {
            return { status: "error", message: "Invalid Form Data" };
        }

        await prisma.course.update({
            where: { id: courseId, userId: user.user.id },
            data: { ...result.data },
        });

        return { status: "success", message: "Course Updated Successfully" };
    } catch {
        return {
            status: "error",
            message:
                "Failed To Update The Course. Please Check Server Logs For Details.",
        };
    }
};

export const reorderLessons = async (
    chapterId: string,
    lessons: { id: string; position: number }[],
    courseId: string,
): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No Lesson Provided For Reordering",
            };
        }

        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: { id: lesson.id, chapterId: chapterId },
                data: { position: lesson.position },
            }),
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return { status: "success", message: "Lessons Reordered Successfully" };
    } catch {
        return {
            status: "error",
            message:
                "Failed To Reorder Lessons. Please Check Server Logs For Details.",
        };
    }
};

export const reorderChapters = async (
    courseId: string,
    chapters: { id: string; position: number }[],
): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No Chapter Provided For Reordering",
            };
        }

        const updates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: { id: chapter.id, courseId: courseId },
                data: { position: chapter.position },
            }),
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapters Reordered Successfully",
        };
    } catch {
        return {
            status: "error",
            message:
                "Failed To Reorder Chapters. Please Check Server Logs For Details.",
        };
    }
};

export const createChapter = async (
    values: ChapterSchemaType,
): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        const result = chapterSchema.safeParse(values);

        if (!result.success) {
            return { status: "error", message: "Invalid Form Data" };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.chapter.findFirst({
                where: { courseId: result.data.courseId },
                select: { position: true },
                orderBy: { position: "desc" },
            });

            await tx.chapter.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1,
                },
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return { status: "success", message: "Chapter Created Successfully" };
    } catch {
        return {
            status: "error",
            message:
                "Failed To Create Chapter. Please Check Server Logs For Details.",
        };
    }
};

export const createLesson = async (
    values: LessonSchemaType,
): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            return { status: "error", message: "Invalid Form Data" };
        }

        await prisma.$transaction(async (tx) => {
            const maxPos = await tx.lesson.findFirst({
                where: { chapterId: result.data.chapterId },
                select: { position: true },
                orderBy: { position: "desc" },
            });

            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    videoKey: result.data.videoKey,
                    thumbnailKey: result.data.thumbnailKey,
                    chapterId: result.data.chapterId,
                    position: (maxPos?.position ?? 0) + 1,
                },
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return { status: "success", message: "Lesson Created Successfully" };
    } catch {
        return {
            status: "error",
            message:
                "Failed To Create Lesson. Please Check Server Logs For Details.",
        };
    }
};

export const deleteChapter = async ({
    chapterId,
    courseId,
}: {
    chapterId: string;
    courseId: string;
}): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        const courseWithChapters = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                chapter: {
                    orderBy: { position: "asc" },
                    select: { id: true, position: true },
                },
            },
        });

        if (!courseWithChapters) {
            return { status: "error", message: "Course Not Found" };
        }

        const chapters = courseWithChapters.chapter;

        const chapterToDelete = chapters.find((chap) => chap.id === chapterId);

        if (!chapterToDelete) {
            return {
                status: "error",
                message: "Chapter Not Found In The Course",
            };
        }

        const remainingChapters = chapters.filter(
            (chap) => chap.id !== chapterId,
        );

        const updates = remainingChapters.map((chap, index) => {
            return prisma.chapter.update({
                where: { id: chap.id },
                data: { position: index + 1 },
            });
        });

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: { id: chapterId },
            }),
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapter Deleted And Position Reordered Successfully",
        };
    } catch (error) {
        return { status: "error", message: "Failed To Delete Chapter." };
    }
};

export const deleteLesson = async ({
    chapterId,
    lessonId,
    courseId,
}: {
    chapterId: string;
    lessonId: string;
    courseId: string;
}): Promise<ApiResponse> => {
    await requireAdmin();

    try {
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: { id: chapterId },
            select: {
                lessons: {
                    orderBy: { position: "asc" },
                    select: { id: true, position: true },
                },
            },
        });

        if (!chapterWithLessons) {
            return { status: "error", message: "Chapter Not Found" };
        }

        const lessons = chapterWithLessons.lessons;

        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson Not Found In The Chapter",
            };
        }

        const remainingLessons = lessons.filter(
            (lesson) => lesson.id !== lessonId,
        );

        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: { id: lesson.id },
                data: { position: index + 1 },
            });
        });

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: { id: lessonId, chapterId: chapterId },
            }),
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lesson Deleted And Position Reordered Successfully",
        };
    } catch (error) {
        return { status: "error", message: "Failed To Delete Lesson." };
    }
};
