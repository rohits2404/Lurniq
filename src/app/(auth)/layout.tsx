import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center px-6 py-10">
            <Link
                href="/"
                className={buttonVariants({
                    variant: "outline",
                    className: "absolute top-6 left-6 h-12 px-5 text-base",
                })}
            >
                <ArrowLeft className="size-5" />
                Back
            </Link>

            <div className="flex w-full max-w-2xl flex-col gap-8">
                {/* Logo */}
                <Link
                    className="flex items-center gap-3 self-center text-xl font-medium"
                    href="/"
                >
                    <Image
                        src="/logo.png"
                        alt="Lurniq"
                        width={44}
                        height={44}
                        className="rounded-lg"
                    />
                    <span>Lurniq</span>
                </Link>

                {children}

                {/* Terms */}
                <div className="text-balance text-center text-sm text-muted-foreground">
                    By Clicking Continue, You Agree To Our{" "}
                    <span className="cursor-pointer hover:text-primary hover:underline">
                        Terms Of Service
                    </span>{" "}
                    and{" "}
                    <span className="cursor-pointer hover:text-primary hover:underline">
                        Privacy Policy
                    </span>
                    .
                </div>
            </div>
        </div>
    );
}
