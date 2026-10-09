import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { deleteLesson } from "@/lib/actions/admin/course/edit";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const DeleteLesson = ({
    chapterId,
    lessonId,
    courseId,
}: {
    chapterId: string;
    lessonId: string;
    courseId: string;
}) => {
    const [Open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const onSubmit = async () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                deleteLesson({
                    chapterId: chapterId,
                    lessonId: lessonId,
                    courseId: courseId,
                }),
            );

            if (error) {
                toast.error(
                    "An Unexpected Error Occured. Please Try Again Later.",
                );
                return;
            }

            if (result.status === "success") {
                toast.success("Lesson Deleted Successfully");
                setOpen(false);
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    };

    return (
        <AlertDialog open={Open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are You Absolutely Sure ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This Action Cannot Be Undone. This Will Permanently
                        Delete The Lesson And All Its Data.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={pending}>
                        {pending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
