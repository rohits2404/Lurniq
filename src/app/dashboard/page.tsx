import { EmptyState } from "@/components/empty-state";
import { getAllCourses } from "@/lib/actions/course/get-all-courses";
import { getEnrolledCourses } from "@/lib/actions/user/get-enrolled-courses";
import { CourseProgressCard } from "@/modules/dashboard/components/course-progress-card";
import { PublicCourseCard } from "@/modules/home/components/public-course-card";
import React from "react";

const DashboardPage = async () => {
    const [courses, enrolledCourses] = await Promise.all([
        getAllCourses(),
        getEnrolledCourses(),
    ]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Enrolled Courses</h1>
                <p className="text-muted-foreground">
                    Here You Can See All The Courses You Have Access To.
                </p>
            </div>

            {enrolledCourses.length === 0 ? (
                <EmptyState
                    title="No Courses Purchased"
                    description="You Have Not Purchased Any Courses Yet. Purchase a Course To Access It Here."
                    buttonText="Browse Courses"
                    href="/courses"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
                        <CourseProgressCard
                            key={course.Course.id}
                            data={course}
                        />
                    ))}
                </div>
            )}

            <section className="mt-10">
                <div className="flex flex-col gap-2 mb-5">
                    <h1 className="text-3xl font-bold">Available Courses</h1>
                    <p className="text-muted-foreground">
                        Here You Can See All The Courses You Can Purchase.
                    </p>
                </div>

                {courses.filter(
                    (course) =>
                        !enrolledCourses.some(
                            ({ Course: enrolled }) => enrolled.id === course.id,
                        ),
                ).length === 0 ? (
                    <EmptyState
                        title="No Courses Available"
                        description="You Have Already Purchased All The Courses Available."
                        buttonText="Browse Courses"
                        href="/courses"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses
                            .filter(
                                (course) =>
                                    !enrolledCourses.some(
                                        ({ Course: enrolled }) =>
                                            enrolled.id === course.id,
                                    ),
                            )
                            .map((course) => (
                                <PublicCourseCard
                                    key={course.id}
                                    data={course}
                                />
                            ))}
                    </div>
                )}
            </section>
        </>
    );
};

export default DashboardPage;
