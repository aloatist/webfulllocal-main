import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: Buffer,
  options: { folder?: string; filename?: string } = {}
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder || 'uploads',
          filename_override: options.filename,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Unknown Cloudinary error'));
          } else {
            resolve(result);
          }
        }
      )
      .end(file);
  });
}

export function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}
