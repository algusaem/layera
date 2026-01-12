"use server";

import { prisma } from "@/lib/prisma";

export async function checkPerfumeExists(name: string) {
  const existing = await prisma.perfume.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    include: { brand: true },
  });

  if (existing) {
    return {
      exists: true,
      perfume: {
        name: existing.name,
        brand: existing.brand.name,
      },
    };
  }

  return { exists: false };
}
