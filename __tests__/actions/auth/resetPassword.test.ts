import { resetPassword } from "@/app/actions/auth/resetPassword";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createMockPasswordResetToken, createMockUser } from "../../utils/factories";

jest.mock("bcryptjs");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("resetPassword action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when token is missing", async () => {
    const result = await resetPassword({ token: "", password: "newpassword123" });

    expect(result).toEqual({ error: "Token and password are required" });
  });

  it("returns error when password is missing", async () => {
    const result = await resetPassword({ token: "valid-token", password: "" });

    expect(result).toEqual({ error: "Token and password are required" });
  });

  it("returns error when password is too short", async () => {
    const result = await resetPassword({ token: "valid-token", password: "12345" });

    expect(result).toEqual({ error: "Password must be at least 6 characters" });
  });

  it("returns error for invalid token", async () => {
    mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);

    const result = await resetPassword({ token: "invalid-token", password: "newpassword123" });

    expect(result).toEqual({ error: "Invalid or expired reset link" });
  });

  it("returns error and deletes expired token", async () => {
    const expiredToken = createMockPasswordResetToken({
      expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      user: createMockUser(),
    });
    mockPrisma.passwordResetToken.findUnique.mockResolvedValue(expiredToken as never);

    const result = await resetPassword({ token: "valid-token", password: "newpassword123" });

    expect(mockPrisma.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { id: expiredToken.id },
    });
    expect(result).toEqual({ error: "Reset link has expired. Please request a new one." });
  });

  it("resets password successfully", async () => {
    const validToken = {
      ...createMockPasswordResetToken(),
      user: createMockUser(),
    };
    mockPrisma.passwordResetToken.findUnique.mockResolvedValue(validToken as never);
    mockBcrypt.hash.mockResolvedValue("new_hashed_password" as never);
    mockPrisma.$transaction.mockImplementation((ops) => Promise.all(ops));

    const result = await resetPassword({ token: "valid-token", password: "newpassword123" });

    expect(mockBcrypt.hash).toHaveBeenCalledWith("newpassword123", 10);
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
