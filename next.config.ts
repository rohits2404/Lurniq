import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:
                    "br-young-grass-b3z3jxtd.storage.c-4.ap-southeast-1.aws.neon.tech",
                pathname: "/lurniq-store/**",
            },
        ],
    },
};

export default nextConfig;
