import { getUserCollection } from "@/app/actions/collection/getUserCollection";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMockSession, createMockPerfumeWithBrand } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("getUserCollection action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getUserCollection();

    expect(result).toEqual([]);
    expect(mockPrisma.userPerfume.findMany).not.toHaveBeenCalled();
  });

  it("returns user collection with approved perfumes", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    const mockUserPerfumes = [
      {
        perfume: {
          id: "perfume-1",
          name: "Sauvage",
          brand: { name: "Dior" },
          imageUrl: "https://example.com/sauvage.jpg",
        },
      },
      {
        perfume: {
          id: "perfume-2",
          name: "Bleu de Chanel",
          brand: { name: "Chanel" },
          imageUrl: "https://example.com/bleu.jpg",
        },
      },
    ];
    mockPrisma.userPerfume.findMany.mockResolvedValue(mockUserPerfumes as never);

    const result = await getUserCollection();

    expect(mockPrisma.userPerfume.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        perfume: { status: "APPROVED" },
      },
      include: {
        perfume: {
          select: {
            id: true,
            name: true,
            brand: { select: { name: true } },
            imageUrl: true,
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });
    expect(result).toEqual([
      { id: "perfume-1", name: "Sauvage", brand: "Dior", imageUrl: "https://example.com/sauvage.jpg" },
      { id: "perfume-2", name: "Bleu de Chanel", brand: "Chanel", imageUrl: "https://example.com/bleu.jpg" },
    ]);
  });

  it("returns empty array when user has no perfumes", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.findMany.mockResolvedValue([]);

    const result = await getUserCollection();

    expect(result).toEqual([]);
  });
});
