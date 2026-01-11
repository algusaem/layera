"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getCollectionCount() {
  const session = await auth();
  if (!session?.user?.id) {
    return 0;
  }

  const count = await prisma.userPerfume.count({
    where: {
      userId: session.user.id,
      perfume: { status: "APPROVED" },
    },
  });

  return count;
}
