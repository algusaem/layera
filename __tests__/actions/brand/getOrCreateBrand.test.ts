import { getOrCreateBrand } from "@/app/actions/brand/getOrCreateBrand";
import { prisma } from "@/lib/prisma";
import { createMockBrand } from "../../utils/factories";


const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("getOrCreateBrand action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when name is empty", async () => {
    const result = await getOrCreateBrand("");

    expect(result).toEqual({ error: "Brand name is required" });
  });

  it("returns error when name is only whitespace", async () => {
    const result = await getOrCreateBrand("   ");

    expect(result).toEqual({ error: "Brand name is required" });
  });

  it("returns existing brand when found (case-insensitive)", async () => {
    const existingBrand = createMockBrand({ name: "Chanel" });
    mockPrisma.brand.findFirst.mockResolvedValue(existingBrand);

    const result = await getOrCreateBrand("chanel");

    expect(mockPrisma.brand.findFirst).toHaveBeenCalledWith({
      where: { name: { equals: "chanel", mode: "insensitive" } },
    });
    expect(mockPrisma.brand.create).not.toHaveBeenCalled();
    expect(result).toEqual({
      brand: { id: existingBrand.id, name: existingBrand.name },
      created: false,
    });
  });

  it("creates new brand when not found", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue(null);
    const newBrand = createMockBrand({ name: "New Brand" });
    mockPrisma.brand.create.mockResolvedValue(newBrand);

    const result = await getOrCreateBrand("  New Brand  ");

    expect(mockPrisma.brand.create).toHaveBeenCalledWith({
      data: { name: "New Brand" },
    });
    expect(result).toEqual({
      brand: { id: newBrand.id, name: newBrand.name },
      created: true,
    });
  });

  it("returns error on database failure", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue(null);
    mockPrisma.brand.create.mockRejectedValue(new Error("DB Error"));

    const result = await getOrCreateBrand("New Brand");

    expect(result).toEqual({ error: "Failed to create brand" });
  });
});
