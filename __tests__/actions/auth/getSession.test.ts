import { getSession } from "@/app/actions/auth/getSession";
import { auth } from "@/lib/auth";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("getSession action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns session when authenticated", async () => {
    const mockSession = createMockSession();
    mockAuth.mockResolvedValue(mockSession);

    const result = await getSession();

    expect(mockAuth).toHaveBeenCalled();
    expect(result).toEqual(mockSession);
  });

  it("returns null when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getSession();

    expect(result).toBeNull();
  });
});
