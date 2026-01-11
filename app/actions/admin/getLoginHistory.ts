"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "./requireAdminRole";

export async function getLoginHistory() {
  await requireAdminRole();

  const sessions = await prisma.session.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return sessions.map((s) => ({
    id: s.id,
    userName: s.user.name,
    userEmail: s.user.email,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    isActive: s.expiresAt > new Date(),
  }));
}
