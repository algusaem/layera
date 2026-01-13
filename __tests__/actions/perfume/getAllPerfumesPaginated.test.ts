import { getAllPerfumesPaginated } from "@/app/actions/perfume/getAllPerfumesPaginated";
import { prisma } from "@/lib/prisma";


const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("getAllPerfumesPaginated action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns paginated perfumes with default params", async () => {
    const mockPerfumes = [
      { id: "1", name: "Sauvage", brand: { name: "Dior" }, imageUrl: "https://example.com/1.jpg" },
      { id: "2", name: "Bleu de Chanel", brand: { name: "Chanel" }, imageUrl: "https://example.com/2.jpg" },
    ];
    mockPrisma.perfume.findMany.mockResolvedValue(mockPerfumes as never);
    mockPrisma.perfume.count.mockResolvedValue(2);

    const result = await getAllPerfumesPaginated();

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith({
      where: {
        imageUrl: { not: null },
        status: "APPROVED",
      },
      skip: 0,
      take: 20,
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        brand: { select: { name: true } },
        imageUrl: true,
      },
    });
    expect(result).toEqual({
      perfumes: [
        { id: "1", name: "Sauvage", brand: "Dior", imageUrl: "https://example.com/1.jpg" },
        { id: "2", name: "Bleu de Chanel", brand: "Chanel", imageUrl: "https://example.com/2.jpg" },
      ],
      pagination: { page: 1, totalPages: 1 },
    });
  });

  it("handles pagination correctly", async () => {
    mockPrisma.perfume.findMany.mockResolvedValue([]);
    mockPrisma.perfume.count.mockResolvedValue(45);

    const result = await getAllPerfumesPaginated({ page: 2, limit: 20 });

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 20,
      })
    );
    expect(result.pagination).toEqual({ page: 2, totalPages: 3 });
  });

  it("filters by search term", async () => {
    mockPrisma.perfume.findMany.mockResolvedValue([]);
    mockPrisma.perfume.count.mockResolvedValue(0);

    await getAllPerfumesPaginated({ search: "Dior" });

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          imageUrl: { not: null },
          status: "APPROVED",
          OR: [
            { name: { contains: "Dior", mode: "insensitive" } },
            { brand: { name: { contains: "Dior", mode: "insensitive" } } },
          ],
        },
      })
    );
  });

  it("returns empty array when no perfumes found", async () => {
    mockPrisma.perfume.findMany.mockResolvedValue([]);
    mockPrisma.perfume.count.mockResolvedValue(0);

    const result = await getAllPerfumesPaginated();

    expect(result).toEqual({
      perfumes: [],
      pagination: { page: 1, totalPages: 0 },
    });
  });
});
