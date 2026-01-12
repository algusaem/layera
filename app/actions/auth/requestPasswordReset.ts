"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { headers } from "next/headers";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

const RESET_TOKEN_EXPIRY_HOURS = 1;

function getBaseUrl() {
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to localhost for development
  return "http://localhost:3000";
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail) {
    return { error: "Email is required" };
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Delete any existing reset tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  // Get base URL from headers or environment
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = host ? `${protocol}://${host}` : getBaseUrl();

  const resetUrl = `${baseUrl}/collection/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: normalizedEmail,
      subject: "Reset your Layera password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p>You requested a password reset for your Layera account.</p>
          <p>Click the button below to reset your password. This link expires in ${RESET_TOKEN_EXPIRY_HOURS} hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Layera - Your Fragrance Layering Assistant</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { error: "Failed to send reset email. Please try again." };
  }

  return { success: true };
}
