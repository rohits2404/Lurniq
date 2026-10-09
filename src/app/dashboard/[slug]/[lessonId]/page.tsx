import { getLessonContent } from "@/lib/actions/course/get-lesson-content";
import { CourseContent } from "@/modules/dashboard/lesson/components/course-content";
import { LessonSkeleton } from "@/modules/dashboard/lesson/components/lesson-skeleton";
import React, { Suspense } from "react";

interface iAppProps {
    params: Promise<{
        lessonId: string;
    }>;
}

const LessonContentPage = async ({ params }: iAppProps) => {
    const { lessonId } = await params;

    return (
        <Suspense fallback={<LessonSkeleton />}>
            <LessonContentLoader lessonId={lessonId} />
        </Suspense>
    );
};

export default LessonContentPage;

const LessonContentLoader = async ({ lessonId }: { lessonId: string }) => {
    const data = await getLessonContent(lessonId);

    return <CourseContent data={data} />;
};
