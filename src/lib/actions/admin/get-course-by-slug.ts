import "server-only";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAdmin } from "./admin";

export const adminGetCoursePreview = async (id: string) => {
    await requireAdmin();

    const course = await prisma.course.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            filekey: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            category: true,
            chapter: {
                orderBy: { position: "asc" },
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        orderBy: { position: "asc" },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            position: true,
                        },
                    },
                },
            },
        },
    });

    if (!course) notFound();

    return course;
};
