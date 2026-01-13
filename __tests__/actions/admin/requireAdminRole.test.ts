import { requireAdminRole } from "@/app/actions/admin/requireAdminRole";
import { auth } from "@/lib/auth";
import { createMockSession, createMockAdminSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("requireAdminRole action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns session for admin users", async () => {
    const adminSession = createMockAdminSession();
    mockAuth.mockResolvedValue(adminSession);

    const result = await requireAdminRole();

    expect(result).toEqual(adminSession);
  });

  it("throws error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(requireAdminRole()).rejects.toThrow("Unauthorized");
  });

  it("throws error for non-admin users", async () => {
    mockAuth.mockResolvedValue(createMockSession());

    await expect(requireAdminRole()).rejects.toThrow("Unauthorized");
  });
});
