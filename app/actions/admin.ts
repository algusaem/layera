"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdminRole() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

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

export async function approvePerfume(id: string) {
  await requireAdminRole();

  await prisma.perfume.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin");
  revalidatePath("/collection/browse");
  return { success: true };
}

export async function rejectPerfume(id: string) {
  await requireAdminRole();

  await prisma.perfume.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
  return { success: true };
}
