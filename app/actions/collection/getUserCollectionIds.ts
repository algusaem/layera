"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserCollectionIds() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userPerfumes = await prisma.userPerfume.findMany({
    where: { userId: session.user.id },
    select: { perfumeId: true },
  });

  return userPerfumes.map((up) => up.perfumeId);
}
