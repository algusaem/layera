import { requireAuth } from "@/app/actions/auth/requireAuth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("requireAuth action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns session when authenticated", async () => {
    const mockSession = createMockSession();
    mockAuth.mockResolvedValue(mockSession);

    const result = await requireAuth();

    expect(result).toEqual(mockSession);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("redirects to login when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await requireAuth();

    expect(mockRedirect).toHaveBeenCalledWith("/collection/login");
  });
});
