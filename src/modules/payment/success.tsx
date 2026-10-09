"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export const PaymentSucessfull = () => {
    const { triggerConfetti } = useConfetti();

    useEffect(() => {
        triggerConfetti();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-1 justify-center items-center">
            <Card className="w-87.5">
                <CardContent>
                    <div className="w-full flex justify-center">
                        <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
                    </div>

                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">
                            Payment Successfull
                        </h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
                            Congrats Your Payment Was Successfull. You Should
                            Now Have To The Course.
                        </p>
                        <Link
                            href="/dashboard"
                            className={buttonVariants({
                                className: "w-full mt-5",
                            })}
                        >
                            <ArrowLeft className="size-4" />
                            Go To Dashboard
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
