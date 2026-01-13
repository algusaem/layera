import { getPendingPerfumes } from "@/app/actions/admin/getPendingPerfumes";
import { requireAdminRole } from "@/app/actions/admin/requireAdminRole";
import { prisma } from "@/lib/prisma";
import { createMockAdminSession } from "../../utils/factories";

jest.mock("@/app/actions/admin/requireAdminRole");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockRequireAdminRole = requireAdminRole as jest.MockedFunction<typeof requireAdminRole>;

describe("getPendingPerfumes action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminRole.mockResolvedValue(createMockAdminSession());
  });

  it("throws when not admin", async () => {
    mockRequireAdminRole.mockRejectedValue(new Error("Unauthorized"));

    await expect(getPendingPerfumes()).rejects.toThrow("Unauthorized");
  });

  it("returns pending perfumes", async () => {
    const mockPerfumes = [
      {
        id: "perfume-1",
        name: "Test Perfume",
        brand: { name: "Test Brand" },
        imageUrl: "https://example.com/image.jpg",
        submitter: { name: "John Doe", email: "john@example.com" },
        createdAt: new Date("2025-01-01"),
      },
    ];
    mockPrisma.perfume.findMany.mockResolvedValue(mockPerfumes as never);

    const result = await getPendingPerfumes();

    expect(mockPrisma.perfume.findMany).toHaveBeenCalledWith({
      where: { status: "PENDING" },
      include: {
        brand: { select: { name: true } },
        submitter: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    expect(result).toEqual([
      {
        id: "perfume-1",
        name: "Test Perfume",
        brand: "Test Brand",
        imageUrl: "https://example.com/image.jpg",
        submittedBy: "John Doe",
        createdAt: new Date("2025-01-01"),
      },
    ]);
  });

  it("handles perfume with null submitter", async () => {
    const mockPerfumes = [
      {
        id: "perfume-1",
        name: "Test Perfume",
        brand: { name: "Test Brand" },
        imageUrl: "https://example.com/image.jpg",
        submitter: null,
        createdAt: new Date("2025-01-01"),
      },
    ];
    mockPrisma.perfume.findMany.mockResolvedValue(mockPerfumes as never);

    const result = await getPendingPerfumes();

    expect(result[0].submittedBy).toBe("Unknown");
  });

  it("uses email when submitter name is null", async () => {
    const mockPerfumes = [
      {
        id: "perfume-1",
        name: "Test Perfume",
        brand: { name: "Test Brand" },
        imageUrl: "https://example.com/image.jpg",
        submitter: { name: null, email: "john@example.com" },
        createdAt: new Date("2025-01-01"),
      },
    ];
    mockPrisma.perfume.findMany.mockResolvedValue(mockPerfumes as never);

    const result = await getPendingPerfumes();

    expect(result[0].submittedBy).toBe("john@example.com");
  });
});
