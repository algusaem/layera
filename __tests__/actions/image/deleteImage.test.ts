import { deleteImage } from "@/app/actions/image/deleteImage";
import { v2 as cloudinary } from "cloudinary";

const mockCloudinary = cloudinary as jest.Mocked<typeof cloudinary>;

describe("deleteImage action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error for invalid URL format", async () => {
    const result = await deleteImage("https://example.com/invalid-url.jpg");

    expect(result).toEqual({ error: "Invalid image URL" });
    expect(mockCloudinary.uploader.destroy).not.toHaveBeenCalled();
  });

  it("returns error for URL without proper path", async () => {
    const result = await deleteImage("https://res.cloudinary.com/test/other/folder/test.jpg");

    expect(result).toEqual({ error: "Invalid image URL" });
  });

  it("deletes image successfully with valid URL", async () => {
    mockCloudinary.uploader.destroy.mockResolvedValue({ result: "ok" } as never);

    const result = await deleteImage(
      "https://res.cloudinary.com/test/layera/perfumes/abc123.jpg"
    );

    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith("layera/perfumes/abc123");
    expect(result).toEqual({ success: true });
  });

  it("handles Cloudinary error", async () => {
    mockCloudinary.uploader.destroy.mockRejectedValue(new Error("Cloudinary error"));

    const result = await deleteImage(
      "https://res.cloudinary.com/test/layera/perfumes/abc123.jpg"
    );

    expect(result).toEqual({ error: "Failed to delete image" });
  });
});
