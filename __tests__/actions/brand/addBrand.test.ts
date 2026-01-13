import { addBrand } from "@/app/actions/brand/addBrand";
import { prisma } from "@/lib/prisma";
import { createMockBrand } from "../../utils/factories";


const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("addBrand action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when name is empty", async () => {
    const result = await addBrand({ name: "" });

    expect(result).toEqual({ error: "Brand name is required" });
  });

  it("returns error when name is only whitespace", async () => {
    const result = await addBrand({ name: "   " });

    expect(result).toEqual({ error: "Brand name is required" });
  });

  it("returns error when brand already exists (case-insensitive)", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue(createMockBrand({ name: "Chanel" }));

    const result = await addBrand({ name: "chanel" });

    expect(mockPrisma.brand.findFirst).toHaveBeenCalledWith({
      where: { name: { equals: "chanel", mode: "insensitive" } },
    });
    expect(result).toEqual({ error: 'Brand "Chanel" already exists' });
  });

  it("creates brand successfully", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue(null);
    const newBrand = createMockBrand({ name: "New Brand" });
    mockPrisma.brand.create.mockResolvedValue(newBrand);

    const result = await addBrand({ name: "  New Brand  " });

    expect(mockPrisma.brand.create).toHaveBeenCalledWith({
      data: { name: "New Brand" },
    });
    expect(result).toEqual({ success: true, brand: newBrand });
  });

  it("returns error on database failure", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue(null);
    mockPrisma.brand.create.mockRejectedValue(new Error("DB Error"));

    const result = await addBrand({ name: "New Brand" });

    expect(result).toEqual({ error: "Failed to add brand" });
  });
});
