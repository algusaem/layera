import { uploadImage } from "@/app/actions/image/uploadImage";

describe("uploadImage action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when no file provided", async () => {
    const formData = new FormData();

    const result = await uploadImage(formData);

    expect(result).toEqual({ error: "No file provided" });
  });

  it("returns error when file is empty", async () => {
    const formData = new FormData();
    const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
    formData.append("file", emptyFile);

    const result = await uploadImage(formData);

    expect(result).toEqual({ error: "No file provided" });
  });

  it("returns error for invalid file type", async () => {
    const formData = new FormData();
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    formData.append("file", file);

    const result = await uploadImage(formData);

    expect(result).toEqual({
      error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF.",
    });
  });

  it("returns error for file too large", async () => {
    const formData = new FormData();
    // Create a 6MB file (over the 5MB limit)
    const largeContent = new Array(6 * 1024 * 1024).fill("a").join("");
    const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
    formData.append("file", file);

    const result = await uploadImage(formData);

    expect(result).toEqual({ error: "File too large. Maximum size is 5MB." });
  });

  it("accepts valid JPEG file", async () => {
    const formData = new FormData();
    const file = new File(["test image content"], "test.jpg", { type: "image/jpeg" });
    formData.append("file", file);

    const result = await uploadImage(formData);

    expect(result.url).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it("accepts valid PNG file", async () => {
    const formData = new FormData();
    const file = new File(["test image content"], "test.png", { type: "image/png" });
    formData.append("file", file);

    const result = await uploadImage(formData);

    expect(result.url).toBeDefined();
  });

  it("accepts valid WebP file", async () => {
    const formData = new FormData();
    const file = new File(["test image content"], "test.webp", { type: "image/webp" });
    formData.append("file", file);

    const result = await uploadImage(formData);

    expect(result.url).toBeDefined();
  });

  it("accepts valid GIF file", async () => {
    const formData = new FormData();
    const file = new File(["test image content"], "test.gif", { type: "image/gif" });
    formData.append("file", file);

    const result = await uploadImage(formData);

    expect(result.url).toBeDefined();
  });
});
