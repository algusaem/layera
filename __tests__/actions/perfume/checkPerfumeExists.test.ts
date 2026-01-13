import { checkPerfumeExists } from "@/app/actions/perfume/checkPerfumeExists";
import { prisma } from "@/lib/prisma";
import { createMockPerfumeWithBrand } from "../../utils/factories";


const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("checkPerfumeExists action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns exists: false when perfume not found", async () => {
    mockPrisma.perfume.findFirst.mockResolvedValue(null);

    const result = await checkPerfumeExists("Non-existent Perfume");

    expect(mockPrisma.perfume.findFirst).toHaveBeenCalledWith({
      where: { name: { equals: "Non-existent Perfume", mode: "insensitive" } },
      include: { brand: true },
    });
    expect(result).toEqual({ exists: false });
  });

  it("returns exists: true with perfume info when found", async () => {
    const mockPerfume = {
      ...createMockPerfumeWithBrand(),
      name: "Sauvage",
      brand: { id: "brand-1", name: "Dior", createdAt: new Date() },
    };
    mockPrisma.perfume.findFirst.mockResolvedValue(mockPerfume as never);

    const result = await checkPerfumeExists("sauvage");

    expect(result).toEqual({
      exists: true,
      perfume: {
        name: "Sauvage",
        brand: "Dior",
      },
    });
  });

  it("performs case-insensitive search", async () => {
    mockPrisma.perfume.findFirst.mockResolvedValue(null);

    await checkPerfumeExists("SAUVAGE");

    expect(mockPrisma.perfume.findFirst).toHaveBeenCalledWith({
      where: { name: { equals: "SAUVAGE", mode: "insensitive" } },
      include: { brand: true },
    });
  });
});
