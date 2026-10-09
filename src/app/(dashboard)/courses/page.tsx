import { getAllCourses } from "@/lib/actions/course/get-all-courses";
import {
    PublicCourseCard,
    PublicCourseCardSkeleton,
} from "@/modules/home/components/public-course-card";
import React, { Suspense } from "react";

const CoursesPage = () => {
    return (
        <div className="mt-5">
            <div className="flex flex-col space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                    Explore Courses
                </h1>
                <p className="text-muted-foregroun">
                    Discover Our Wide Range Of Courses Designed To Help You
                    Achieve Your Learnings Goals.
                </p>
            </div>

            <Suspense fallback={<LoadingSkeletonLayout />}>
                <RenderPublicCourses />
            </Suspense>
        </div>
    );
};

export default CoursesPage;

export const RenderPublicCourses = async () => {
    const courses = await getAllCourses();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course} />
            ))}
        </div>
    );
};

export const LoadingSkeletonLayout = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    );
};
