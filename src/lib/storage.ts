import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

export const S3 = new S3Client({
    region: process.env.AWS_REGION ?? "us-east-2",
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});
