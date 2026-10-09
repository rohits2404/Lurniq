"use client";

import { RenderDescription } from "@/components/rich-text-editor/render-description";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { LessonContentType } from "@/lib/actions/course/get-lesson-content";
import { MarklessonComplete } from "@/lib/actions/dashboard";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface iAppProps {
    data: LessonContentType;
}

export const CourseContent = ({ data }: iAppProps) => {
    const [isPending, startTransition] = useTransition();
    const { triggerConfetti } = useConfetti();

    const VideoPlayer = ({
        thumbnailKey,
        videoKey,
    }: {
        thumbnailKey: string;
        videoKey: string;
    }) => {
        const videoUrl = useConstructUrl(videoKey);
        const thumbnailUrl = useConstructUrl(thumbnailKey);

        if (!videoKey) {
            return (
                <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                    <BookIcon className="size-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        This Lesson Does Not Have a Video Yet
                    </p>
                </div>
            );
        }

        return (
            <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                <video
                    className="w-full h-full object-cover"
                    controls
                    poster={thumbnailUrl}
                >
                    <source src={videoUrl} type="video/mp4" />
                    <source src={videoUrl} type="video/webm" />
                    <source src={videoUrl} type="video/ogg" />
                    Your Browser Does Not Support The Video Tag.
                </video>
            </div>
        );
    };

    const onSubmit = () => {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                MarklessonComplete(data.id, data.Chapter?.Course?.slug ?? ""),
            );

            if (error) {
                toast.error("An Unexpected Error Occurred");
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                triggerConfetti();
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-background pl-6">
            <VideoPlayer
                thumbnailKey={data.thumbnailKey ?? ""}
                videoKey={data.videoKey ?? ""}
            />

            <div className="py-4 border-b">
                {data.lessonProgress.length > 0 ? (
                    <Button
                        variant="outline"
                        className="bg-green-500/10 text-green-500 hover:text-green-600"
                    >
                        <CheckCircle className="size-4 mr-2 text-green-500" />
                        Completed
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        <CheckCircle className="size-4 mr-2 text-green-500" />
                        Mark As Complete
                    </Button>
                )}
            </div>

            <div className="space-y-3 pt-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {data.title}
                </h1>
                {data.description && (
                    <RenderDescription json={JSON.parse(data.description)} />
                )}
            </div>
        </div>
    );
};
