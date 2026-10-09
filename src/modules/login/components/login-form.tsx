"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const router = useRouter();

    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();

    const [email, setEmail] = useState("");

    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Github Sign In Successfull");
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    },
                },
            });
        });
    }

    function signInWithEmail() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email Sent");
                        router.push(
                            `/verify-request?email=${encodeURIComponent(email)}`,
                        );
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Error Sending Email");
                    },
                },
            });
        });
    }

    return (
        <Card className="w-full">
            <CardHeader className="space-y-3 px-8 pt-8">
                <CardTitle className="text-3xl">Welcome Back!</CardTitle>

                <CardDescription className="text-lg">
                    Login With Your Github Email Account
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 px-8 pb-8">
                {/* GitHub */}
                <Button
                    disabled={githubPending}
                    onClick={signInWithGithub}
                    className="h-14 w-full text-lg"
                    variant="outline"
                >
                    {githubPending ? (
                        <>
                            <Loader className="size-5 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <FaGithub className="size-5" />
                            Sign In With GitHub
                        </>
                    )}
                </Button>

                {/* Divider */}
                <div
                    className="
            relative text-center text-base
            after:absolute after:inset-0 after:top-1/2
            after:z-0 after:flex after:items-center
            after:border-t after:border-border
          "
                >
                    <span className="relative z-10 bg-card px-3 text-muted-foreground">
                        Or Continue With
                    </span>
                </div>

                {/* Email */}
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-base">
                            Email
                        </Label>

                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="h-14 text-base"
                            required
                        />
                    </div>

                    <Button
                        onClick={signInWithEmail}
                        disabled={emailPending}
                        className="h-14 text-lg"
                    >
                        {emailPending ? (
                            <>
                                <Loader className="size-5 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <Send className="size-5" />
                                <span>Continue With Email</span>
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
