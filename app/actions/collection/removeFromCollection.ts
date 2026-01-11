"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function removeFromCollection(perfumeId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  try {
    await prisma.userPerfume.deleteMany({
      where: {
        userId: session.user.id,
        perfumeId,
      },
    });

    revalidatePath("/collection/browse");
    return { success: true };
  } catch {
    return { error: "Failed to remove perfume from collection" };
  }
}
