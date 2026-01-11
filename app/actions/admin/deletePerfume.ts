"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminRole } from "./requireAdminRole";
import { deleteImage } from "@/app/actions/image/deleteImage";

export async function deletePerfume(id: string) {
  await requireAdminRole();

  const perfume = await prisma.perfume.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (!perfume) {
    return { error: "Perfume not found" };
  }

  // Delete from database (cascades to UserPerfume, LayerPerfume)
  await prisma.perfume.delete({
    where: { id },
  });

  // Delete image from Cloudinary
  if (perfume.imageUrl) {
    await deleteImage(perfume.imageUrl);
  }

  revalidatePath("/admin/perfumes");
  revalidatePath("/collection/browse");
  return { success: true };
}
