import { requireAdmin } from "@/lib/actions/admin/admin";
import { S3 } from "@/lib/storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const deleteFileSchema = z.object({
    key: z.string().trim().min(1).max(1024),
});

export async function DELETE(request: Request) {
    try {
        // 1. Verify admin authentication.
        const session = await requireAdmin();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // 2. Parse the request body.
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 },
            );
        }

        // 3. Validate the object key.
        const validation = deleteFileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Missing Or Invalid Object Key" },
                { status: 400 },
            );
        }

        const { key } = validation.data;

        // 4. Read the Neon Object Storage bucket.
        const bucket = process.env.S3_BUCKET_NAME;

        if (!bucket) {
            console.error("S3_BUCKET_NAME Is Not Configured");

            return NextResponse.json(
                { error: "Storage Is Not Configured" },
                { status: 500 },
            );
        }

        // 5. Delete the object from Neon Object Storage.
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        await S3.send(command);

        return NextResponse.json(
            { message: "File Deleted Successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error Deleting File:", error);

        return NextResponse.json(
            { error: "Unable To Delete File" },
            { status: 500 },
        );
    }
}
