"use server";

import { prisma } from "@/lib/prisma";
import type { Perfume } from "@/types";

type GetPerfumesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getAllPerfumesPaginated({
  page = 1,
  limit = 20,
  search = "",
}: GetPerfumesParams = {}) {
  const skip = (page - 1) * limit;

  const where = {
    imageUrl: { not: null },
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { brand: { name: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [perfumesRaw, total] = await Promise.all([
    prisma.perfume.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        brand: { select: { name: true } },
        imageUrl: true,
      },
    }),
    prisma.perfume.count({ where }),
  ]);

  const perfumes = perfumesRaw.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand.name,
    imageUrl: p.imageUrl!,
  })) as Perfume[];

  return {
    perfumes,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
