import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./admin";

export const adminGetRecentCourses = async () => {
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            filekey: true,
            slug: true,
        },
    });

    return data;
};
