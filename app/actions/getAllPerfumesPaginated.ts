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
            { brand: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [perfumesRaw, total] = await Promise.all([
    prisma.perfume.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ brand: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        brand: true,
        imageUrl: true,
      },
    }),
    prisma.perfume.count({ where }),
  ]);

  const perfumes = perfumesRaw as Perfume[];

  return {
    perfumes,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}
