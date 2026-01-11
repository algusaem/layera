"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut, auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  name?: string;
};

export async function login(data: LoginData) {
  const { email, password } = data;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
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

export async function logout() {
  await signOut({ redirect: false });
  redirect("/collection/login");
}

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/collection/login");
  }
  return session;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

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
