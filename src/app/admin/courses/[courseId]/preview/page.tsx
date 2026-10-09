import { adminGetCoursePreview } from "@/lib/actions/admin/get-course-by-slug";
import { AdminCoursePreview } from "@/modules/admin/course/components/admin-course-preview";
import React from "react";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

const CoursePreviewPage = async ({ params }: PageProps) => {
    const { courseId } = await params;
    const course = await adminGetCoursePreview(courseId);

    return <AdminCoursePreview data={course} />;
};

export default CoursePreviewPage;
