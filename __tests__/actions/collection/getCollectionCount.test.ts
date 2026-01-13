import { getCollectionCount } from "@/app/actions/collection/getCollectionCount";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("getCollectionCount action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 0 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getCollectionCount();

    expect(result).toBe(0);
    expect(mockPrisma.userPerfume.count).not.toHaveBeenCalled();
  });

  it("returns count of approved perfumes in collection", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.count.mockResolvedValue(5);

    const result = await getCollectionCount();

    expect(mockPrisma.userPerfume.count).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        perfume: { status: "APPROVED" },
      },
    });
    expect(result).toBe(5);
  });
});
