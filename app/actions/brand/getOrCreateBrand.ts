"use server";

import { prisma } from "@/lib/prisma";

interface GetOrCreateBrandResult {
  brand?: {
    id: string;
    name: string;
  };
  created?: boolean;
  error?: string;
}

export async function getOrCreateBrand(name: string): Promise<GetOrCreateBrandResult> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { error: "Brand name is required" };
  }

  // Check if brand already exists
  const existing = await prisma.brand.findFirst({
    where: { name: { equals: trimmedName, mode: "insensitive" } },
  });

  if (existing) {
    return {
      brand: { id: existing.id, name: existing.name },
      created: false,
    };
  }

  // Create new brand
  try {
    const brand = await prisma.brand.create({
      data: { name: trimmedName },
    });

    return {
      brand: { id: brand.id, name: brand.name },
      created: true,
    };
  } catch {
    return { error: "Failed to create brand" };
  }
}
