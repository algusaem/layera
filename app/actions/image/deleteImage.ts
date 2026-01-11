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
