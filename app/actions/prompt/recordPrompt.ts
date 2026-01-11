"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function recordPrompt() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.promptUsage.create({
    data: {
      userId: session.user.id,
    },
  });

  return { success: true };
}
