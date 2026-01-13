import { getAllPerfumesAdmin } from "@/app/actions/admin/getAllPerfumesAdmin";
import { requireAdminRole } from "@/app/actions/admin/requireAdminRole";
import { prisma } from "@/lib/prisma";
import { createMockAdminSession } from "../../utils/factories";

jest.mock("@/app/actions/admin/requireAdminRole");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockRequireAdminRole = requireAdminRole as jest.MockedFunction<typeof requireAdminRole>;

describe("getAllPerfumesAdmin action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminRole.mockResolvedValue(createMockAdminSession());
  });

  it("throws when not admin", async () => {
    mockRequireAdminRole.mockRejectedValue(new Error("Unauthorized"));

    await expect(getAllPerfumesAdmin()).rejects.toThrow("Unauthorized");
  });

  it("returns paginated perfumes with default params", async () => {
    const mockPerfumes = [
      {
        id: "1",
        name: "Sauvage",
        brand: { name: "Dior" },
        imageUrl: "https://example.com/1.jpg",
        status: "APPROVED",
        createdAt: new Date("2025-01-01"),
      },
    ];
    mockPrisma.perfume.findMany.mockResolvedValue(mockPerfumes as never);
    mockPrisma.perfume.count.mockResolvedValue(1);

    const result = await getAllPerfumesAdmin();

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
        orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
      })
    );
    expect(result).toEqual({
      perfumes: [
        {
          id: "1",
          name: "Sauvage",
          brand: "Dior",
          imageUrl: "https://example.com/1.jpg",
          status: "APPROVED",
          createdAt: new Date("2025-01-01"),
        },
      ],
      pagination: { page: 1, totalPages: 1, total: 1 },
    });
  });

  it("filters by search term", async () => {
    mockPrisma.perfume.findMany.mockResolvedValue([]);
    mockPrisma.perfume.count.mockResolvedValue(0);

    await getAllPerfumesAdmin({ search: "Dior" });

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: "Dior", mode: "insensitive" } },
            { brand: { name: { contains: "Dior", mode: "insensitive" } } },
          ],
        },
      })
    );
  });

  it("handles pagination correctly", async () => {
    mockPrisma.perfume.findMany.mockResolvedValue([]);
    mockPrisma.perfume.count.mockResolvedValue(45);

    const result = await getAllPerfumesAdmin({ page: 2, limit: 20 });

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 20,
      })
    );
    expect(result.pagination).toEqual({ page: 2, totalPages: 3, total: 45 });
  });
});
