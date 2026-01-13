import { login } from "@/app/actions/auth/login";
import { signIn, auth } from "@/lib/auth";
import { createMockSession, createMockAdminSession } from "../../utils/factories";

// Get the AuthError from the globally mocked next-auth
const { AuthError: MockAuthError } = jest.requireMock("next-auth");

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("login action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when email is missing", async () => {
    const result = await login({ email: "", password: "password123" });

    expect(result).toEqual({ error: "Email and password are required" });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("returns error when password is missing", async () => {
    const result = await login({ email: "test@example.com", password: "" });

    expect(result).toEqual({ error: "Email and password are required" });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("returns success with user role on successful login", async () => {
    mockSignIn.mockResolvedValue(undefined);
    mockAuth.mockResolvedValue(createMockSession());

    const result = await login({ email: "test@example.com", password: "password123" });

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
    });
    expect(result).toEqual({ success: true, role: "USER" });
  });

  it("returns admin role for admin users", async () => {
    mockSignIn.mockResolvedValue(undefined);
    mockAuth.mockResolvedValue(createMockAdminSession());

    const result = await login({ email: "admin@example.com", password: "adminpass" });

    expect(result).toEqual({ success: true, role: "ADMIN" });
  });

  it("returns error on AuthError", async () => {
    mockSignIn.mockRejectedValue(new MockAuthError("Invalid credentials"));

    const result = await login({ email: "test@example.com", password: "wrongpassword" });

    expect(result).toEqual({ error: "Invalid email or password" });
  });

  it("throws non-AuthError errors", async () => {
    const genericError = new Error("Database connection failed");
    mockSignIn.mockRejectedValue(genericError);

    await expect(login({ email: "test@example.com", password: "password123" }))
      .rejects.toThrow("Database connection failed");
  });
});
