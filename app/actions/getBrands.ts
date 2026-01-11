"use server";

import { prisma } from "@/lib/prisma";

export async function getBrands() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return brands;
}
