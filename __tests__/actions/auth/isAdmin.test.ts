import { isAdmin } from "@/app/actions/auth/isAdmin";
import { auth } from "@/lib/auth";
import { createMockSession, createMockAdminSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("isAdmin action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true for admin users", async () => {
    mockAuth.mockResolvedValue(createMockAdminSession());

    const result = await isAdmin();

    expect(result).toBe(true);
  });

  it("returns false for regular users", async () => {
    mockAuth.mockResolvedValue(createMockSession());

    const result = await isAdmin();

    expect(result).toBe(false);
  });

  it("returns false when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await isAdmin();

    expect(result).toBe(false);
  });
});
