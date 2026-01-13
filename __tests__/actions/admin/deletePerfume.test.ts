import { deletePerfume } from "@/app/actions/admin/deletePerfume";
import { requireAdminRole } from "@/app/actions/admin/requireAdminRole";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/app/actions/image/deleteImage";
import { revalidatePath } from "next/cache";
import { createMockAdminSession, createMockPerfume } from "../../utils/factories";

jest.mock("@/app/actions/admin/requireAdminRole");
jest.mock("@/app/actions/image/deleteImage");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockRequireAdminRole = requireAdminRole as jest.MockedFunction<typeof requireAdminRole>;
const mockDeleteImage = deleteImage as jest.MockedFunction<typeof deleteImage>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

describe("deletePerfume action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminRole.mockResolvedValue(createMockAdminSession());
  });

  it("throws when not admin", async () => {
    mockRequireAdminRole.mockRejectedValue(new Error("Unauthorized"));

    await expect(deletePerfume("perfume-1")).rejects.toThrow("Unauthorized");
  });

  it("returns error when perfume not found", async () => {
    mockPrisma.perfume.findUnique.mockResolvedValue(null);

    const result = await deletePerfume("perfume-1");

    expect(result).toEqual({ error: "Perfume not found" });
  });

  it("deletes perfume and image successfully", async () => {
    mockPrisma.perfume.findUnique.mockResolvedValue({
      imageUrl: "https://res.cloudinary.com/test/layera/perfumes/test.jpg",
    } as never);
    mockPrisma.perfume.delete.mockResolvedValue(createMockPerfume() as never);
    mockDeleteImage.mockResolvedValue({ success: true });

    const result = await deletePerfume("perfume-1");

    expect(mockPrisma.perfume.delete).toHaveBeenCalledWith({
      where: { id: "perfume-1" },
    });
    expect(mockDeleteImage).toHaveBeenCalledWith(
      "https://res.cloudinary.com/test/layera/perfumes/test.jpg"
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/perfumes");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/collection/browse");
    expect(result).toEqual({ success: true });
  });

  it("does not delete image when imageUrl is null", async () => {
    mockPrisma.perfume.findUnique.mockResolvedValue({ imageUrl: null } as never);
    mockPrisma.perfume.delete.mockResolvedValue(createMockPerfume() as never);

    await deletePerfume("perfume-1");

    expect(mockDeleteImage).not.toHaveBeenCalled();
  });
});
