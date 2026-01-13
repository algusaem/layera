import { getBrands } from "@/app/actions/brand/getBrands";
import { prisma } from "@/lib/prisma";
import { createMockBrand } from "../../utils/factories";


const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("getBrands action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns empty array when no brands exist", async () => {
    mockPrisma.brand.findMany.mockResolvedValue([]);

    const result = await getBrands();

    expect(mockPrisma.brand.findMany).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    expect(result).toEqual([]);
  });

  it("returns brands sorted by name", async () => {
    const brands = [
      { id: "1", name: "Armani" },
      { id: "2", name: "Chanel" },
      { id: "3", name: "Dior" },
    ];
    mockPrisma.brand.findMany.mockResolvedValue(brands);

    const result = await getBrands();

    expect(result).toEqual(brands);
  });
});
