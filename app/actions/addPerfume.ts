/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "./uploadImage";

type AddPerfumeData = {
  name: string;
  brand: string;
};

export async function addPerfume(data: AddPerfumeData, formData: FormData) {
  const { name, brand } = data;

  if (!name || !brand) {
    return { error: "Name and brand are required" };
  }

  const file = formData.get("image") as File;
  if (!file || file.size === 0) {
    return { error: "Image is required" };
  }

  const existingPerfume = await prisma.perfume.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" } },
  });

  if (existingPerfume) {
    return {
      error: `A perfume named "${existingPerfume.name}" already exists (by ${existingPerfume.brand})`,
    };
  }

  // Upload image
  const imageFormData = new FormData();
  imageFormData.append("file", file);
  const uploadResult = await uploadImage(imageFormData);

  if (uploadResult.error) {
    return { error: uploadResult.error };
  }
  const imageUrl = uploadResult.url!;

  try {
    await prisma.perfume.create({
      data: {
        name: name.trim(),
        brand: brand.trim(),
        imageUrl,
      },
    });

    return { success: true };
  } catch (error: any) {
    // Rollback: delete uploaded image if database operation fails
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

    if (error.code === "P2002") {
      return { error: "This perfume already exists in the database" };
    }
    return { error: "Failed to add perfume" };
  }
}
