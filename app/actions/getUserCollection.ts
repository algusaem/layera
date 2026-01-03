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
    where: { userId: session.user.id },
    include: {
      perfume: {
        select: {
          id: true,
          name: true,
          brand: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  return userPerfumes.map((up) => up.perfume as Perfume);
}
