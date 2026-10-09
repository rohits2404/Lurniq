import { adminGetLesson } from "@/lib/actions/admin/admin-get-lesson";
import { LessonForm } from "@/modules/admin/course/components/lesson-form";
import React from "react";

interface Props {
    params: Promise<{
        lessonId: string;
        chapterId: string;
        courseId: string;
    }>;
}

const LessonIdPage = async ({ params }: Props) => {
    const { lessonId, chapterId, courseId } = await params;

    const lesson = await adminGetLesson(lessonId);

    return (
        <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />
    );
};

export default LessonIdPage;
