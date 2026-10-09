"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback } from "react";

export function useSignOut() {
    const router = useRouter();

    const signOut = useCallback(async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                        toast.success("Logged Out successfully");
                    },
                    onError: (error: any) => {
                        console.error("Log Out Error:", error);
                        toast.error("Failed To Log Out");
                    },
                },
            });
        } catch (error) {
            console.error("Log Out Error:", error);
            toast.error("Failed To Log Out");
        }
    }, [router]);

    return { signOut };
}
