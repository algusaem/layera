"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "./requireAdminRole";

export async function getPendingPerfumes() {
  await requireAdminRole();

  const perfumes = await prisma.perfume.findMany({
    where: { status: "PENDING" },
    include: {
      brand: { select: { name: true } },
      submitter: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return perfumes.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand.name,
    imageUrl: p.imageUrl,
    submittedBy: p.submitter?.name || p.submitter?.email || "Unknown",
    createdAt: p.createdAt,
  }));
}
