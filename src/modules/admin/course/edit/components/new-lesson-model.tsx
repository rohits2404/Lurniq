import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { createLesson } from "@/lib/actions/admin/course/edit";
import { lessonSchema, LessonSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const NewLessonModal = ({
    courseId,
    chapterId,
}: {
    courseId: string;
    chapterId: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            chapterId: chapterId,
        },
    });

    const onSubmit = async (values: LessonSchemaType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                createLesson(values),
            );
            if (error) {
                toast.error(
                    "An Unexpected Error Occured. Please Try Again Later.",
                );
                return;
            }

            if (result.status === "success") {
                toast.success("Lesson Created Successfully");
                form.reset();
                setIsOpen(false);
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        setIsOpen(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-center gap-1"
                >
                    <Plus className="size-4" /> New Lesson
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>New Lesson</DialogTitle>
                    <DialogDescription>
                        What Would You Like To Name Your Lesson?
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className="space-y-8"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Lesson Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={pending}>
                                {pending ? "Saving..." : "Save Change"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
