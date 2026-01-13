import { requireAdmin } from "@/app/actions/auth/requireAdmin";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createMockSession, createMockAdminSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

// Helper to make redirect throw like Next.js does
const setupRedirectMock = () => {
  mockRedirect.mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  });
};

describe("requireAdmin action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupRedirectMock();
  });

  it("returns session for admin users", async () => {
    const mockSession = createMockAdminSession();
    mockAuth.mockResolvedValue(mockSession);

    const result = await requireAdmin();

    expect(result).toEqual(mockSession);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("redirects to login when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT: /collection/login");
    expect(mockRedirect).toHaveBeenCalledWith("/collection/login");
  });

  it("redirects to collection when user is not admin", async () => {
    mockAuth.mockResolvedValue(createMockSession());

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT: /collection");
    expect(mockRedirect).toHaveBeenCalledWith("/collection");
  });
});
