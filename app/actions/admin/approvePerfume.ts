"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminRole } from "./requireAdminRole";

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
