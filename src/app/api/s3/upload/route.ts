import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { basename } from "node:path";
import { S3 } from "@/lib/storage";
import { requireAdmin } from "@/lib/actions/admin/admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
];

export const fileUploadSchema = z.object({
    fileName: z.string().trim().min(1).max(255),
    contentType: z.string().min(1),
    size: z.number().int().positive().max(MAX_FILE_SIZE),
    isImage: z.boolean(),
});

export async function POST(request: Request) {
    try {
        // 1. Verify admin authentication.
        const session = await requireAdmin();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // 2. Parse request body.
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON Body" },
                { status: 400 },
            );
        }

        // 3. Validate request.
        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid Request Body",
                    details: z.treeifyError(validation.error),
                },
                { status: 400 },
            );
        }

        const { fileName, contentType, size, isImage } = validation.data;

        // 4. Validate image types when uploading images.
        if (isImage && !ALLOWED_IMAGE_TYPES.includes(contentType)) {
            return NextResponse.json(
                { error: "Unsupported Image Type" },
                { status: 400 },
            );
        }

        const bucket = process.env.S3_BUCKET_NAME;

        if (!bucket) {
            console.error("S3_BUCKET_NAME Is Not Configured");

            return NextResponse.json(
                { error: "Storage Is Not Configured" },
                { status: 500 },
            );
        }

        // 5. Generate a unique object key.
        const safeFileName = basename(fileName).replace(
            /[^a-zA-Z0-9._-]/g,
            "_",
        );

        const key = `${randomUUID()}-${safeFileName}`;

        // 6. Create the S3-compatible upload command.
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        });

        // 7. Generate a temporary upload URL.
        const presignedUrl = await getSignedUrl(S3, command, {
            expiresIn: 360,
            signableHeaders: new Set(["content-type"]),
        });

        // 8. Return the URL and object key.
        return NextResponse.json({
            presignedUrl,
            key,
        });
    } catch (error) {
        console.error("Error Generating Upload URL:", error);

        return NextResponse.json(
            { error: "Unable To Generate Upload URL" },
            { status: 500 },
        );
    }
}
