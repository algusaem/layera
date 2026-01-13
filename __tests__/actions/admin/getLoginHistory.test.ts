import { getLoginHistory } from "@/app/actions/admin/getLoginHistory";
import { requireAdminRole } from "@/app/actions/admin/requireAdminRole";
import { prisma } from "@/lib/prisma";
import { createMockAdminSession } from "../../utils/factories";

jest.mock("@/app/actions/admin/requireAdminRole");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockRequireAdminRole = requireAdminRole as jest.MockedFunction<typeof requireAdminRole>;

describe("getLoginHistory action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminRole.mockResolvedValue(createMockAdminSession());
  });

  it("throws when not admin", async () => {
    mockRequireAdminRole.mockRejectedValue(new Error("Unauthorized"));

    await expect(getLoginHistory()).rejects.toThrow("Unauthorized");
  });

  it("returns login history with active session status", async () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const mockSessions = [
      {
        id: "session-1",
        user: { name: "John Doe", email: "john@example.com" },
        createdAt: new Date("2025-01-01"),
        expiresAt: futureDate,
      },
      {
        id: "session-2",
        user: { name: "Jane Doe", email: "jane@example.com" },
        createdAt: new Date("2025-01-01"),
        expiresAt: pastDate,
      },
    ];
    mockPrisma.session.findMany.mockResolvedValue(mockSessions as never);

    const result = await getLoginHistory();

    expect(mockPrisma.session.findMany).toHaveBeenCalledWith({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    expect(result[0].isActive).toBe(true);
    expect(result[1].isActive).toBe(false);
  });
});
