import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminGetCourse } from "@/lib/actions/admin/admin-get-course";
import { CourseStructure } from "@/modules/admin/course/edit/components/course-structure";
import { EditCourseForm } from "@/modules/admin/course/edit/components/edit-course-form";

interface Props {
    params: Promise<{ courseId: string }>;
}

const EditCoursePage = async ({ params }: Props) => {
    const { courseId } = await params;

    const data = await adminGetCourse(courseId);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course: <span>{data.title}</span>
            </h1>

            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">
                        Course Structure
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>
                                Edit Basic Information About The Course
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <EditCourseForm data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>
                                Here You Can Update Your Course Structure
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <CourseStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EditCoursePage;
