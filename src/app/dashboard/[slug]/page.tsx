import { getCourseSidebarData } from "@/lib/actions/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import React from "react";

interface iAppProps {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}

const CourseSlugRoute = async ({ params, children }: iAppProps) => {
    const { slug } = await params;

    const course = await getCourseSidebarData(slug);
    const firstChapter = course.course.chapter[0];
    const firstLesson = firstChapter.lessons[0];

    if (firstLesson) {
        redirect(`/dashboard/${slug}/${firstLesson.id}`);
    }

    return (
        <div className="flex items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-2">No Lesson Available</h2>
            <p className="text-muted-foreground">
                This Course Does Not Have Any Lessons Yet.
            </p>
        </div>
    );
};

export default CourseSlugRoute;
