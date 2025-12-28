/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

type AddPerfumeData = {
  name: string;
  brand: string;
  imageUrl?: string;
};

export async function addPerfume(data: AddPerfumeData) {
  const { name, brand, imageUrl } = data;

  if (!name || !brand) {
    return { error: "Name and brand are required" };
  }

  const existingPerfume = await prisma.perfume.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" } },
  });

  if (existingPerfume) {
    return {
      error: `A perfume named "${existingPerfume.name}" already exists (by ${existingPerfume.brand})`,
    };
  }

  try {
    await prisma.perfume.create({
      data: {
        name: name.trim(),
        brand: brand.trim(),
        imageUrl: imageUrl?.trim() || null,
      },
    });

    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "This perfume already exists in the database" };
    }
    return { error: "Failed to add perfume" };
  }
}
