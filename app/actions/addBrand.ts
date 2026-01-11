"use server";

import { prisma } from "@/lib/prisma";

interface AddBrandData {
  name: string;
}

export async function addBrand(data: AddBrandData) {
  const name = data.name.trim();

  if (!name) {
    return { error: "Brand name is required" };
  }

  const existing = await prisma.brand.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (existing) {
    return { error: `Brand "${existing.name}" already exists` };
  }

  try {
    const brand = await prisma.brand.create({
      data: { name },
    });

    return { success: true, brand };
  } catch {
    return { error: "Failed to add brand" };
  }
}
