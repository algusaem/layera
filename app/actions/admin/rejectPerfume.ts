"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminRole } from "./requireAdminRole";

export async function rejectPerfume(id: string) {
  await requireAdminRole();

  await prisma.perfume.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
  return { success: true };
}
