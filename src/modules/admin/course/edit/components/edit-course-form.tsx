"use client";

import { AdminCourseSingularType } from "@/lib/actions/admin/admin-get-course";
import {
    courseCategories,
    courseLevels,
    courseSchema,
    CourseSchemaType,
    courseStatus,
} from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tryCatch } from "@/hooks/try-catch";
import { editCourse } from "@/lib/actions/admin/course/edit";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor/editor";
import { Uploader } from "@/components/file-uploader/uploader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { generateSlug } from "@/lib/utils";

interface iAppProps {
    data: AdminCourseSingularType;
}

export const EditCourseForm = ({ data }: iAppProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: data.title,
            description: data.description,
            filekey: data.filekey,
            price: data.price,
            duration: data.duration,
            level: data.level,
            category: data.category as CourseSchemaType["category"],
            status: data.status,
            slug: data.slug,
            smallDescription: data.smallDescription,
        },
    });

    const onSubmit = (values: CourseSchemaType) => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                editCourse(values, data.id),
            );

            if (error) {
                toast.error("An Unexpected Error Occurred");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                form.reset();
                router.push("/admin/courses");
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-end gap-4">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="Slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="button"
                        className="w-fit"
                        onClick={() => {
                            form.setValue("slug", generateSlug(), {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        }}
                    >
                        Generate Slug
                        <SparkleIcon className="ml-1" size={16} />
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Small Description"
                                    className="min-h-30"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <RichTextEditor field={field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="filekey"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Thumbnail image</FormLabel>
                            <FormControl>
                                <Uploader
                                    onChange={field.onChange}
                                    value={field.value}
                                    fileTypeAccepted="image"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {courseCategories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>level</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Value" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {courseLevels.map((level) => (
                                            <SelectItem
                                                key={level}
                                                value={level}
                                            >
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Duration (hours)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Duration"
                                        type="number"
                                        {...field}
                                        value={
                                            Number.isNaN(field.value)
                                                ? ""
                                                : field.value
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Price"
                                        type="number"
                                        {...field}
                                        value={
                                            Number.isNaN(field.value)
                                                ? ""
                                                : field.value
                                        }
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Status</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    {courseStatus.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            Saving...
                            <Loader2 className="animate-spin ml-1" />
                        </>
                    ) : (
                        <>
                            Save Changes <PlusIcon className="ml-1" size={16} />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
};
