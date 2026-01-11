"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const RATE_LIMIT = 10;
const WINDOW_MINUTES = 60;

export async function getPromptUsage() {
  const session = await auth();
  if (!session?.user?.id) {
    return { count: 0, remaining: RATE_LIMIT, resetAt: null, isLimited: false };
  }

  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const prompts = await prisma.promptUsage.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: windowStart },
    },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  const count = prompts.length;
  const remaining = Math.max(0, RATE_LIMIT - count);
  const isLimited = count >= RATE_LIMIT;

  // Calculate when the oldest prompt expires (user can send again)
  let resetAt: Date | null = null;
  if (isLimited && prompts.length > 0) {
    const oldestPrompt = prompts[0];
    resetAt = new Date(oldestPrompt.createdAt.getTime() + WINDOW_MINUTES * 60 * 1000);
  }

  return { count, remaining, resetAt, isLimited };
}
