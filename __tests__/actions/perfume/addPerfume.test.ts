import { addPerfume } from "@/app/actions/perfume/addPerfume";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/app/actions/image/uploadImage";
import { deleteImage } from "@/app/actions/image/deleteImage";
import { createMockSession, createMockAdminSession, createMockPerfumeWithBrand } from "../../utils/factories";

jest.mock("@/lib/auth");
jest.mock("@/app/actions/image/uploadImage");
jest.mock("@/app/actions/image/deleteImage");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockUploadImage = uploadImage as jest.MockedFunction<typeof uploadImage>;
const mockDeleteImage = deleteImage as jest.MockedFunction<typeof deleteImage>;

describe("addPerfume action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await addPerfume({ name: "Test", brandId: "brand-1" });

    expect(result).toEqual({ error: "You must be logged in to add a perfume" });
  });

  it("returns error when name is missing", async () => {
    mockAuth.mockResolvedValue(createMockSession());

    const result = await addPerfume({ name: "", brandId: "brand-1" });

    expect(result).toEqual({ error: "Name and brand are required" });
  });

  it("returns error when brandId is missing", async () => {
    mockAuth.mockResolvedValue(createMockSession());

    const result = await addPerfume({ name: "Test", brandId: "" });

    expect(result).toEqual({ error: "Name and brand are required" });
  });

  it("returns error when no image provided", async () => {
    mockAuth.mockResolvedValue(createMockSession());

    const result = await addPerfume({ name: "Test", brandId: "brand-1" });

    expect(result).toEqual({ error: "Image is required" });
  });

  it("returns error when perfume already exists", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.perfume.findFirst.mockResolvedValue(
      createMockPerfumeWithBrand({ name: "Sauvage" }) as never
    );

    const result = await addPerfume({
      name: "Sauvage",
      brandId: "brand-1",
      imageUrl: "https://example.com/image.jpg",
    });

    expect(result.error).toContain("already exists");
  });

  it("creates perfume with APPROVED status for admin users", async () => {
    mockAuth.mockResolvedValue(createMockAdminSession());
    mockPrisma.perfume.findFirst.mockResolvedValue(null);
    mockPrisma.perfume.create.mockResolvedValue({
      id: "new-perfume",
      name: "New Perfume",
    } as never);

    const result = await addPerfume({
      name: "New Perfume",
      brandId: "brand-1",
      imageUrl: "https://example.com/image.jpg",
    });

    expect(mockPrisma.perfume.create).toHaveBeenCalledWith({
      data: {
        name: "New Perfume",
        brandId: "brand-1",
        imageUrl: "https://example.com/image.jpg",
        status: "APPROVED",
        submittedBy: "admin-1",
      },
    });
    expect(result).toEqual({ success: true, pending: false });
  });

  it("creates perfume with PENDING status for regular users", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.perfume.findFirst.mockResolvedValue(null);
    mockPrisma.perfume.create.mockResolvedValue({
      id: "new-perfume",
      name: "New Perfume",
    } as never);

    const result = await addPerfume({
      name: "New Perfume",
      brandId: "brand-1",
      imageUrl: "https://example.com/image.jpg",
    });

    expect(mockPrisma.perfume.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        status: "PENDING",
      }),
    });
    expect(result).toEqual({ success: true, pending: true });
  });

  it("uploads image from FormData when provided", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.perfume.findFirst.mockResolvedValue(null);
    mockUploadImage.mockResolvedValue({ url: "https://cloudinary.com/uploaded.jpg" });
    mockPrisma.perfume.create.mockResolvedValue({
      id: "new-perfume",
      name: "New Perfume",
    } as never);

    const formData = new FormData();
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    formData.append("image", file);

    const result = await addPerfume({ name: "New Perfume", brandId: "brand-1" }, formData);

    expect(mockUploadImage).toHaveBeenCalled();
    expect(result).toEqual({ success: true, pending: true });
  });

  it("deletes uploaded image on database error", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.perfume.findFirst.mockResolvedValue(null);
    mockUploadImage.mockResolvedValue({ url: "https://cloudinary.com/uploaded.jpg" });
    mockPrisma.perfume.create.mockRejectedValue(new Error("DB Error"));

    const formData = new FormData();
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    formData.append("image", file);

    const result = await addPerfume({ name: "New Perfume", brandId: "brand-1" }, formData);

    expect(mockDeleteImage).toHaveBeenCalledWith("https://cloudinary.com/uploaded.jpg");
    expect(result).toEqual({ error: "Failed to add perfume" });
  });

  it("handles P2002 unique constraint error", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.perfume.findFirst.mockResolvedValue(null);
    const uniqueError = new Error("Unique constraint failed");
    (uniqueError as { code?: string }).code = "P2002";
    mockPrisma.perfume.create.mockRejectedValue(uniqueError);

    const result = await addPerfume({
      name: "New Perfume",
      brandId: "brand-1",
      imageUrl: "https://example.com/image.jpg",
    });

    expect(result).toEqual({ error: "This perfume already exists in the database" });
  });
});
