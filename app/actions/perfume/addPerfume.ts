/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/app/actions/image/uploadImage";
import { deleteImage } from "@/app/actions/image/deleteImage";

interface AddPerfumeData {
  name: string;
  brandId: string;
}

export async function addPerfume(data: AddPerfumeData, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to add a perfume" };
  }

  const isAdmin = session.user.role === "ADMIN";
  const name = data.name.trim();
  const brandId = data.brandId;

  if (!name || !brandId) {
    return { error: "Name and brand are required" };
  }

  const file = formData.get("image") as File;
  if (!file || file.size === 0) {
    return { error: "Image is required" };
  }

  const existingPerfume = await prisma.perfume.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    include: { brand: true },
  });

  if (existingPerfume) {
    return {
      error: `A perfume named "${existingPerfume.name}" already exists (by ${existingPerfume.brand.name})`,
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
        name,
        brandId,
        imageUrl,
        status: isAdmin ? "APPROVED" : "PENDING",
        submittedBy: session.user.id,
      },
    });

    return {
      success: true,
      pending: !isAdmin,
    };
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
