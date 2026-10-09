import { EmptyState } from "@/components/empty-state";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { adminGetEnrollmentStats } from "@/lib/actions/admin/admin-get-enrollment-stats";
import { adminGetRecentCourses } from "@/lib/actions/admin/admin-get-recent-courses";
import {
    AdminCourseCard,
    AdminCourseCardSkeleton,
} from "@/modules/admin/course/components/admin-course-card";
import Link from "next/link";
import React, { Suspense } from "react";

const AdminPage = async () => {
    const enrollmentData = await adminGetEnrollmentStats();

    return (
        <>
            <SectionCards />

            <ChartAreaInteractive data={enrollmentData} />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Courses</h2>
                    <Link
                        className={buttonVariants({
                            variant: "outline",
                        })}
                        href="/admin/courses"
                    >
                        View All Courses
                    </Link>
                </div>

                <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
                    <RenderRecentCourses />
                </Suspense>
            </div>
        </>
    );
};

export default AdminPage;

export const RenderRecentCourses = async () => {
    const data = await adminGetRecentCourses();
    if (data.length === 0) {
        return (
            <EmptyState
                buttonText="Create a New Course"
                description="You Haven't Created Any Courses Yet. Create Some To See Them Here."
                title="You Don't Have Any Courses Yet!"
                href="/admin/courses/create"
            />
        );
    }

    return (
        <div className="relative px-12">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {data.map((course) => (
                        <CarouselItem key={course.id} className="md:basis-1/2">
                            <AdminCourseCard data={course} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export const RenderRecentCoursesSkeletonLayout = async () => {
    return (
        <div className="relative px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, index) => (
                    <AdminCourseCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
