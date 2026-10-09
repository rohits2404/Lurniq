"use client";

import { useConstructUrl } from "@/hooks/use-construct-url";
import { AdminCourseSingularType } from "@/lib/actions/admin/admin-get-course";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    BookOpen,
    Clock3,
    GraduationCap,
    PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
    data: AdminCourseSingularType;
}

export function AdminCoursePreview({ data }: Props) {
    const thumbnailUrl = useConstructUrl(data.filekey);

    const chapters = [...data.chapter].sort((a, b) => a.position - b.position);

    const lessonCount = chapters.reduce(
        (total, chapter) => total + chapter.lessons.length,
        0,
    );

    return (
        <main className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-6xl space-y-8 p-4 py-8 md:p-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href={`/admin/courses`}
                        className={buttonVariants({
                            variant: "outline",
                            className: "gap-2",
                        })}
                    >
                        <ArrowLeft className="size-4" />
                        Back To Courses
                    </Link>

                    <Badge
                        variant={
                            data.status === "Published"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {data.status}
                    </Badge>
                </div>

                {/* Course hero */}
                <section className="grid items-center gap-8 overflow-hidden rounded-2xl border bg-card p-5 shadow-sm md:grid-cols-2 md:p-8">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                        <Image
                            src={thumbnailUrl}
                            alt={data.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    <div className="space-y-5">
                        <Badge variant="outline">{data.category}</Badge>

                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {data.title}
                        </h1>

                        <p className="leading-7 text-muted-foreground">
                            {data.smallDescription}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Clock3 className="size-4 text-primary" />
                                {data.duration} Hours
                            </span>

                            <span className="flex items-center gap-2">
                                <GraduationCap className="size-4 text-primary" />
                                {data.level}
                            </span>

                            <span className="flex items-center gap-2">
                                <BookOpen className="size-4 text-primary" />
                                {chapters.length} Chapters
                            </span>
                        </div>

                        <div className="border-t pt-5">
                            <p className="text-sm text-muted-foreground">
                                Course Price
                            </p>

                            <p className="mt-1 text-3xl font-bold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                }).format(data.price)}
                            </p>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            This Is An Admin Preview. Enrollment And Payment Are
                            Not Available Here.
                        </p>
                    </div>
                </section>

                {/* Description */}

                <section className="rounded-2xl border bg-card p-6 md:p-8">
                    <h2 className="text-2xl font-semibold">
                        About This Course
                    </h2>

                    <div className="mt-4 leading-7 text-muted-foreground">
                        {(() => {
                            try {
                                const doc = JSON.parse(data.description);

                                if (
                                    doc.type !== "doc" ||
                                    !Array.isArray(doc.content)
                                ) {
                                    return <p>{data.description}</p>;
                                }

                                const renderNodes = (
                                    nodes: any[],
                                    keyPrefix = "node",
                                ) =>
                                    nodes.map((node, index) => {
                                        const key = `${keyPrefix}-${index}`;

                                        if (node.type === "text") {
                                            let content: React.ReactNode =
                                                node.text;

                                            for (const mark of node.marks ??
                                                []) {
                                                if (mark.type === "bold") {
                                                    content = (
                                                        <strong key={key}>
                                                            {content}
                                                        </strong>
                                                    );
                                                } else if (
                                                    mark.type === "italic"
                                                ) {
                                                    content = (
                                                        <em key={key}>
                                                            {content}
                                                        </em>
                                                    );
                                                } else if (
                                                    mark.type === "strike"
                                                ) {
                                                    content = (
                                                        <s key={key}>
                                                            {content}
                                                        </s>
                                                    );
                                                } else if (
                                                    mark.type === "code"
                                                ) {
                                                    content = (
                                                        <code key={key}>
                                                            {content}
                                                        </code>
                                                    );
                                                }
                                            }

                                            return (
                                                <React.Fragment key={key}>
                                                    {content}
                                                </React.Fragment>
                                            );
                                        }

                                        const children = renderNodes(
                                            node.content ?? [],
                                            key,
                                        );

                                        switch (node.type) {
                                            case "heading": {
                                                const level = Math.min(
                                                    6,
                                                    Math.max(
                                                        1,
                                                        node.attrs?.level ?? 2,
                                                    ),
                                                );

                                                const textAlign = [
                                                    "left",
                                                    "center",
                                                    "right",
                                                    "justify",
                                                ].includes(
                                                    node.attrs?.textAlign,
                                                )
                                                    ? node.attrs.textAlign
                                                    : undefined;

                                                const className =
                                                    "mb-3 mt-5 font-semibold text-foreground";

                                                const props = {
                                                    key,
                                                    className,
                                                    style: { textAlign },
                                                };

                                                if (level === 1)
                                                    return (
                                                        <h2 {...props}>
                                                            {children}
                                                        </h2>
                                                    );
                                                if (level === 2)
                                                    return (
                                                        <h3 {...props}>
                                                            {children}
                                                        </h3>
                                                    );
                                                if (level === 3)
                                                    return (
                                                        <h4 {...props}>
                                                            {children}
                                                        </h4>
                                                    );
                                                if (level === 4)
                                                    return (
                                                        <h5 {...props}>
                                                            {children}
                                                        </h5>
                                                    );
                                                if (level === 5)
                                                    return (
                                                        <h6 {...props}>
                                                            {children}
                                                        </h6>
                                                    );

                                                return (
                                                    <h6 {...props}>
                                                        {children}
                                                    </h6>
                                                );
                                            }

                                            case "paragraph": {
                                                const textAlign = [
                                                    "left",
                                                    "center",
                                                    "right",
                                                    "justify",
                                                ].includes(
                                                    node.attrs?.textAlign,
                                                )
                                                    ? node.attrs.textAlign
                                                    : undefined;

                                                return (
                                                    <p
                                                        key={key}
                                                        style={{ textAlign }}
                                                        className="mb-4 last:mb-0"
                                                    >
                                                        {children}
                                                    </p>
                                                );
                                            }

                                            case "bulletList":
                                                return (
                                                    <ul
                                                        key={key}
                                                        className="mb-4 list-disc space-y-2 pl-6"
                                                    >
                                                        {children}
                                                    </ul>
                                                );

                                            case "orderedList":
                                                return (
                                                    <ol
                                                        key={key}
                                                        className="mb-4 list-decimal space-y-2 pl-6"
                                                    >
                                                        {children}
                                                    </ol>
                                                );

                                            case "listItem":
                                                return (
                                                    <li key={key}>
                                                        {children}
                                                    </li>
                                                );

                                            case "blockquote":
                                                return (
                                                    <blockquote
                                                        key={key}
                                                        className="my-4 border-l-2 pl-4 italic"
                                                    >
                                                        {children}
                                                    </blockquote>
                                                );

                                            case "hardBreak":
                                                return <br key={key} />;

                                            default:
                                                return (
                                                    <React.Fragment key={key}>
                                                        {children}
                                                    </React.Fragment>
                                                );
                                        }
                                    });

                                return renderNodes(doc.content);
                            } catch {
                                return (
                                    <p className="whitespace-pre-wrap">
                                        {data.description}
                                    </p>
                                );
                            }
                        })()}
                    </div>
                </section>

                {/* Curriculum */}
                <section className="space-y-5">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Course Curriculum
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {chapters.length} Chapters · {lessonCount} Lessons
                        </p>
                    </div>

                    {chapters.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center">
                            <BookOpen className="mx-auto size-8 text-muted-foreground" />

                            <p className="mt-3 font-medium">
                                No Chapters Added Yet
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Add Chapters And Lessons In The Course Editor.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {chapters.map((chapter, index) => {
                                const lessons = [...chapter.lessons].sort(
                                    (a, b) => a.position - b.position,
                                );

                                return (
                                    <details
                                        key={chapter.id}
                                        open={index === 0}
                                        className="group overflow-hidden rounded-xl border bg-card"
                                    >
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
                                            <span>
                                                <span className="mr-3 text-muted-foreground">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>
                                                {chapter.title}
                                            </span>

                                            <span className="shrink-0 text-sm text-muted-foreground">
                                                {lessons.length} Lessons
                                            </span>
                                        </summary>

                                        <div className="border-t">
                                            {lessons.length === 0 ? (
                                                <p className="p-4 text-sm text-muted-foreground">
                                                    No Lessons In This Chapter.
                                                </p>
                                            ) : (
                                                lessons.map(
                                                    (lesson, lessonIndex) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center gap-3 border-b p-4 last:border-b-0"
                                                        >
                                                            <PlayCircle className="size-5 shrink-0 text-primary" />

                                                            <div className="min-w-0">
                                                                <p className="font-medium">
                                                                    {lessonIndex +
                                                                        1}
                                                                    .{" "}
                                                                    {
                                                                        lesson.title
                                                                    }
                                                                </p>

                                                                {lesson.description && (
                                                                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                                        {
                                                                            lesson.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )
                                            )}
                                        </div>
                                    </details>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
