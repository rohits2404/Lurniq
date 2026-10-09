"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { enrollInCourseAction } from "@/lib/actions/course/actions";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export const EnrollmentButton = ({ courseId }: { courseId: string }) => {
    const [isPending, startTransition] = useTransition();

    const onSubmit = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                enrollInCourseAction(courseId),
            );

            if (error) {
                toast.error("An Unexpected Error Occurred");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    };

    return (
        <Button className="w-full" onClick={onSubmit} disabled={isPending}>
            {isPending ? (
                <>
                    <Loader2 className="animate-spin size-4" />
                    Loading...
                </>
            ) : (
                <>Enroll Now!</>
            )}
        </Button>
    );
};
