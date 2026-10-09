"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export const VerifyForm = () => {
    const [otp, setOtp] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    const params = useSearchParams();
    const router = useRouter();

    const email = params.get("email") as string;
    const isOtpCompleted = otp.length === 6;

    useEffect(() => {
        if (!email) {
            toast.error("Email Parameter Is Missing");
            router.push("/login");
        } else {
            setIsLoading(false);
        }
    }, [email, router]);

    function verifyOtp() {
        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email,
                otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed In Successfully");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("Error Verifying Email/OTP");
                    },
                },
            });
        });
    }

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="size-6 animate-spin" />
                    <span className="ml-3 text-base">Loading...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="space-y-3 px-8 pt-8 text-center">
                <CardTitle className="text-3xl">
                    Please Check Your Email
                </CardTitle>

                <CardDescription className="text-lg leading-relaxed">
                    We Have Sent A Verification Code To Your Email Address.
                    Please Check Your Email And Enter The Code Below.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-8 px-8 pb-8">
                {/* OTP */}
                <div className="flex flex-col items-center gap-4">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        disabled={isPending}
                    >
                        <InputOTPGroup className="gap-2">
                            <InputOTPSlot
                                index={0}
                                className="size-14 text-xl"
                            />
                            <InputOTPSlot
                                index={1}
                                className="size-14 text-xl"
                            />
                            <InputOTPSlot
                                index={2}
                                className="size-14 text-xl"
                            />
                        </InputOTPGroup>

                        <InputOTPGroup className="ml-4 gap-2">
                            <InputOTPSlot
                                index={3}
                                className="size-14 text-xl"
                            />
                            <InputOTPSlot
                                index={4}
                                className="size-14 text-xl"
                            />
                            <InputOTPSlot
                                index={5}
                                className="size-14 text-xl"
                            />
                        </InputOTPGroup>
                    </InputOTP>

                    <p className="text-base text-muted-foreground">
                        Enter The 6-Digit Code Sent To Your Email
                    </p>
                </div>

                {/* Verify Button */}
                <Button
                    onClick={verifyOtp}
                    className="h-14 w-full text-lg"
                    disabled={isPending || !isOtpCompleted}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        "Verify Account"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
