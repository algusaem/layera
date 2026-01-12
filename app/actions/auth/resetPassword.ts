"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface ResetPasswordData {
  token: string;
  password: string;
}

export async function resetPassword({ token, password }: ResetPasswordData) {
  if (!token || !password) {
    return { error: "Token and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return { error: "Invalid or expired reset link" };
  }

  if (resetToken.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    return { error: "Reset link has expired. Please request a new one." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password and delete the token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    }),
  ]);

  return { success: true };
}
