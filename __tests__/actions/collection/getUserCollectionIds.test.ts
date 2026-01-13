import { getUserCollectionIds } from "@/app/actions/collection/getUserCollectionIds";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("getUserCollectionIds action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getUserCollectionIds();

    expect(result).toEqual([]);
    expect(mockPrisma.userPerfume.findMany).not.toHaveBeenCalled();
  });

  it("returns perfume IDs from user collection", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.findMany.mockResolvedValue([
      { perfumeId: "perfume-1" },
      { perfumeId: "perfume-2" },
      { perfumeId: "perfume-3" },
    ] as never);

    const result = await getUserCollectionIds();

    expect(mockPrisma.userPerfume.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: { perfumeId: true },
    });
    expect(result).toEqual(["perfume-1", "perfume-2", "perfume-3"]);
  });
});
