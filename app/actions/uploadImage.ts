"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImage(url: string) {
  try {
    // Extract public_id from URL: https://res.cloudinary.com/.../layera/perfumes/abc123.jpg
    const matches = url.match(/layera\/perfumes\/([^.]+)/);
    if (!matches) return { error: "Invalid image URL" };

    const publicId = `layera/perfumes/${matches[1]}`;
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { error: "Failed to delete image" };
  }
}

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF." };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { error: "File too large. Maximum size is 5MB." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "layera/perfumes",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        )
        .end(buffer);
    });

    return { url: result.secure_url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }
}
