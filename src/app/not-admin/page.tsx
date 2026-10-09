import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX, ShieldCheck } from "lucide-react";
import Link from "next/link";

const NotAdminPage = () => {
    return (
        <main className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-10">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/5 blur-[120px]" />
                <div className="absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <div className="w-full max-w-2xl">
                {/* Brand */}
                <Link
                    href="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
                    <span className="flex size-11 items-center justify-center overflow-hidden rounded-xl border bg-background shadow-sm">
                        <img
                            src="/logo.png"
                            alt="Lurniq"
                            className="size-full object-contain"
                        />
                    </span>
                    <span className="text-2xl font-semibold tracking-tight">
                        Lurniq
                    </span>
                </Link>

                {/* Restriction Card */}
                <Card className="border-border/70 bg-card/90 shadow-2xl shadow-black/5 backdrop-blur-sm">
                    <CardHeader className="items-center space-y-5 px-8 pt-10 text-center sm:px-12 sm:pt-12">
                        <div className="flex size-20 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
                            <ShieldX className="size-10 text-destructive" />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-destructive">
                                Access Restricted
                            </p>

                            <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                                This Area Is For Admins
                            </CardTitle>

                            <CardDescription className="mx-auto max-w-lg text-base leading-7 sm:text-lg">
                                You Don't Have Permission To Access This Page.
                                Admin Privileges Are Required To Create And
                                Manage Courses.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4 px-8 pb-10 pt-6 sm:px-12 sm:pb-12">
                        <Link
                            href="/"
                            className={buttonVariants({
                                size: "lg",
                                className: "h-12 w-full gap-2 text-base",
                            })}
                        >
                            <ArrowLeft className="size-4" />
                            Back To Home
                        </Link>

                        <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                            <ShieldCheck className="size-4 shrink-0" />
                            Your Account Is Safe. You Just Don't Have Admin
                            Access.
                        </p>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Lurniq · Learn At Your Own Pace
                </p>
            </div>
        </main>
    );
};

export default NotAdminPage;
