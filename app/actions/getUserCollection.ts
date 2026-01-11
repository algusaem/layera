"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Perfume } from "@/types";

export async function getUserCollection() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userPerfumes = await prisma.userPerfume.findMany({
    where: {
      userId: session.user.id,
      perfume: { status: "APPROVED" },
    },
    include: {
      perfume: {
        select: {
          id: true,
          name: true,
          brand: { select: { name: true } },
          imageUrl: true,
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  return userPerfumes.map((up) => ({
    id: up.perfume.id,
    name: up.perfume.name,
    brand: up.perfume.brand.name,
    imageUrl: up.perfume.imageUrl!,
  })) as Perfume[];
}
