import { register } from "@/app/actions/auth/register";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { createMockUser } from "../../utils/factories";

// Get the AuthError from the globally mocked next-auth
const { AuthError: MockAuthError } = jest.requireMock("next-auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("register action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when email is missing", async () => {
    const result = await register({ email: "", password: "password123" });

    expect(result).toEqual({ error: "Email and password are required" });
  });

  it("returns error when password is missing", async () => {
    const result = await register({ email: "test@example.com", password: "" });

    expect(result).toEqual({ error: "Email and password are required" });
  });

  it("returns error when password is too short", async () => {
    const result = await register({ email: "test@example.com", password: "12345" });

    expect(result).toEqual({ error: "Password must be at least 6 characters" });
  });

  it("returns error when user already exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(createMockUser());

    const result = await register({ email: "test@example.com", password: "password123" });

    expect(result).toEqual({ error: "An account with this email already exists" });
  });

  it("creates user and signs in on successful registration", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockBcrypt.hash.mockResolvedValue("hashed_password" as never);
    mockPrisma.user.create.mockResolvedValue(createMockUser());
    mockSignIn.mockResolvedValue(undefined);

    const result = await register({
      email: "  New@Example.COM  ",
      password: "password123",
      name: "  Test User  ",
    });

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "new@example.com" },
    });
    expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "new@example.com",
        password: "hashed_password",
        name: "Test User",
      },
    });
    expect(mockSignIn).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("handles sign-in failure after account creation", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockBcrypt.hash.mockResolvedValue("hashed_password" as never);
    mockPrisma.user.create.mockResolvedValue(createMockUser());
    mockSignIn.mockRejectedValue(new MockAuthError("Sign in failed"));

    const result = await register({ email: "test@example.com", password: "password123" });

    expect(result).toEqual({ error: "Account created but failed to sign in" });
  });

  it("handles null name by setting it to null", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockBcrypt.hash.mockResolvedValue("hashed_password" as never);
    mockPrisma.user.create.mockResolvedValue(createMockUser({ name: null }));
    mockSignIn.mockResolvedValue(undefined);

    await register({ email: "test@example.com", password: "password123" });

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        password: "hashed_password",
        name: null,
      },
    });
  });
});
