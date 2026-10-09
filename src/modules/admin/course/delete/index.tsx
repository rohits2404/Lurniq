"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { DeleteCourse } from "@/lib/actions/admin/course/delete";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const DeleteCourseForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { courseId } = useParams<{ courseId: string }>();

    const onSubmit = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                DeleteCourse(courseId),
            );

            if (error) {
                toast.error("An Unexpected Error Occurred");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                router.push("/admin/courses");
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>
                        Are You Sure You Want To Delete This Course ?
                    </CardTitle>
                    <CardDescription>
                        This Action Cannot Be Undone.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link
                        href="/admin/courses"
                        className={buttonVariants({ variant: "outline" })}
                    >
                        Cancel
                    </Link>

                    <Button
                        variant="destructive"
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                Delete Course
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteCourseForm;
