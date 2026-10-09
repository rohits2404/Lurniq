"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureProps {
    title: string;
    description: string;
    icon: string;
}

const features: FeatureProps[] = [
    {
        title: "Comprehensive Courses",
        description:
            "Access a wide range of carefully curated courses designed by industry experts.",
        icon: "📚",
    },
    {
        title: "Interactive Learning",
        description:
            "Engage with interactive content, quizzes, and assessments to enhance your learning experience.",
        icon: "🎮",
    },
    {
        title: "Progress Tracking",
        description:
            "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
        icon: "📊",
    },
    {
        title: "Community Support",
        description:
            "Connect with fellow learners, instructors, and industry experts for peer-to-peer support and collaboration.",
        icon: "👥",
    },
];

export function Landing() {
    return (
        <div className="relative h-full">
            {/* Decorative background */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -top-24 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
                <div className="absolute bottom-0 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_70%_60%_at_50%_40%,#000_40%,transparent_100%)]" />
            </div>

            {/* Scroll container (scrollbar hidden, only kicks in on very small screens) */}
            <div className="h-full overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-h-full flex-col">
                    <div className="my-auto flex flex-col gap-10 py-6 lg:gap-14">
                        {/* Hero */}
                        <section className="relative">
                            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                                <Badge
                                    variant="outline"
                                    className="gap-2 rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                    </span>
                                    The Future Of Online Education
                                </Badge>

                                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                                    <span className="bg-linear-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                        Elevate Your Learning Experience
                                    </span>
                                </h1>

                                <p className="max-w-175 text-muted-foreground md:text-xl">
                                    Discover A New Way To Learn With Our Modern,
                                    Interactive Learning Management System.
                                    Access High-Quality Courses Anytime,
                                    Anywhere.
                                </p>

                                <div className="mt-2 flex flex-col gap-4 sm:flex-row">
                                    <Link
                                        href="/courses"
                                        className={cn(
                                            buttonVariants({ size: "lg" }),
                                            "rounded-full px-8 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40",
                                        )}
                                    >
                                        Explore Courses
                                    </Link>
                                    <Link
                                        href="/login"
                                        className={cn(
                                            buttonVariants({
                                                size: "lg",
                                                variant: "outline",
                                            }),
                                            "rounded-full bg-background/60 px-8 backdrop-blur transition-all hover:-translate-y-0.5",
                                        )}
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Features */}
                        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="group relative overflow-hidden border-border/60 bg-card/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <CardHeader className="gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-fuchsia-500/15 text-2xl ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                            {feature.icon}
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <CardContent className="p-0">
                                            <p className="text-sm text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
