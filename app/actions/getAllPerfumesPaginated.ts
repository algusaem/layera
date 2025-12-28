"use server";

import { prisma } from "@/lib/prisma";

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

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { brand: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [perfumes, total] = await Promise.all([
    prisma.perfume.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ brand: "asc" }, { name: "asc" }],
    }),
    prisma.perfume.count({ where }),
  ]);

  return {
    perfumes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + perfumes.length < total,
    },
  };
}
