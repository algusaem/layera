"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addToCollection(perfumeId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to add perfumes to your collection" };
  }

  try {
    await prisma.userPerfume.create({
      data: {
        userId: session.user.id,
        perfumeId,
      },
    });

    revalidatePath("/collection/browse");
    return { success: true };
  } catch {
    return { error: "Failed to add perfume to collection" };
  }
}
