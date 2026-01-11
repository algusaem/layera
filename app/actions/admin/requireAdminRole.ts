"use server";

import { auth } from "@/lib/auth";

export async function requireAdminRole() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}
