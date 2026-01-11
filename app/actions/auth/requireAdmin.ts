"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    redirect("/collection/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/collection");
  }
  return session;
}
