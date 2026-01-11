"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export async function register(data: RegisterData) {
  const { email, password, name } = data;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name?.trim() || null,
    },
  });

  // Sign in after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created but failed to sign in" };
    }
    throw error;
  }
}
