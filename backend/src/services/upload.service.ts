import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { MediaType } from '@prisma/client';

const localUploadsDir = path.join(process.cwd(), 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
}

const s3 = process.env.AWS_S3_BUCKET
  ? new S3Client({
      region: process.env.AWS_S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  : null;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function getMediaType(mimetype: string): MediaType {
  if (mimetype.startsWith('image/')) return 'IMAGE';
  if (mimetype.startsWith('video/')) return 'VIDEO';
  return 'DOCUMENT';
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<{ url: string; publicId?: string; type: MediaType }> {
  const type = getMediaType(mimetype);

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'techloom', resource_type: type === 'VIDEO' ? 'video' : 'auto' },
          (err, res) => (err ? reject(err) : resolve(res!))
        );
        stream.end(buffer);
      }
    );
    return { url: result.secure_url, publicId: result.public_id, type };
  }

  if (s3 && process.env.AWS_S3_BUCKET) {
    const key = `uploads/${uuidv4()}-${filename}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      })
    );
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    return { url, publicId: key, type };
  }

  // Local disk fallback for dev
  ensureUploadsDir();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${uuidv4()}-${safeName}`;
  fs.writeFileSync(path.join(localUploadsDir, key), buffer);
  const baseUrl =
    process.env.API_PUBLIC_URL ||
    process.env.FIREBASE_FUNCTION_URL ||
    `http://localhost:${process.env.PORT || 4000}`;
  return {
    url: `${baseUrl}/uploads/${key}`,
    publicId: key,
    type,
  };
}