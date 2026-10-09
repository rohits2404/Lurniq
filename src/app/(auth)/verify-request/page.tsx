import { VerifyForm } from "@/modules/login/components/verify-form";
import React, { Suspense } from "react";

const VerifyEmailPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <p>Loading...</p>
                </div>
            }
        >
            <VerifyForm />
        </Suspense>
    );
};

export default VerifyEmailPage;
