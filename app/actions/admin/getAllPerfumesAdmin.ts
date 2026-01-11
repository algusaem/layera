"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "./requireAdminRole";

interface GetPerfumesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getAllPerfumesAdmin({
  page = 1,
  limit = 20,
  search = "",
}: GetPerfumesParams = {}) {
  await requireAdminRole();

  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { brand: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [perfumes, total] = await Promise.all([
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
        status: true,
        createdAt: true,
      },
    }),
    prisma.perfume.count({ where }),
  ]);

  return {
    perfumes: perfumes.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand.name,
      imageUrl: p.imageUrl,
      status: p.status,
      createdAt: p.createdAt,
    })),
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  };
}
