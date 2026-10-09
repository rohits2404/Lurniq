import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";

import { prisma } from "@/lib/db";
import { sendOTPEmail } from "@/lib/emailjs";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
        },
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                await sendOTPEmail({
                    email,
                    otp,
                });
            },
        }),
    ],
});
