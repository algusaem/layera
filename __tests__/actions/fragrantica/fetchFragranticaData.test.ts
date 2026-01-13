import { fetchFragranticaData } from "@/app/actions/fragrantica/fetchFragranticaData";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("fetchFragranticaData action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error for non-Fragrantica URL", async () => {
    const result = await fetchFragranticaData("https://example.com/perfume");

    expect(result).toEqual({ error: "URL must be from fragrantica.com" });
  });

  it("returns error for invalid Fragrantica URL format", async () => {
    const result = await fetchFragranticaData("https://www.fragrantica.com/invalid");

    expect(result).toEqual({ error: "Invalid Fragrantica URL format" });
  });

  it("returns error for malformed perfume URL", async () => {
    const result = await fetchFragranticaData(
      "https://www.fragrantica.com/perfume/Brand/InvalidSlug"
    );

    expect(result).toEqual({ error: "Invalid Fragrantica URL format" });
  });

  it("parses valid Fragrantica URL correctly", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });

    const result = await fetchFragranticaData(
      "https://www.fragrantica.com/perfume/Versace/Eros-16657.html"
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://fimgs.net/mdimg/perfume-thumbs/375x500.16657.jpg",
      expect.any(Object)
    );
    expect(result.data).toBeDefined();
    expect(result.data?.brand).toBe("Versace");
    expect(result.data?.name).toBe("Eros");
  });

  it("handles multi-word brand names", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });

    const result = await fetchFragranticaData(
      "https://www.fragrantica.com/perfume/Maison-Francis-Kurkdjian/Baccarat-Rouge-540-33519.html"
    );

    expect(result.data?.brand).toBe("Maison Francis Kurkdjian");
    expect(result.data?.name).toBe("Baccarat Rouge 540");
  });

  it("returns error when image download fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchFragranticaData(
      "https://www.fragrantica.com/perfume/Versace/Eros-16657.html"
    );

    expect(result).toEqual({ error: "Failed to download image: 404" });
  });

  it("returns error on fetch exception", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const result = await fetchFragranticaData(
      "https://www.fragrantica.com/perfume/Versace/Eros-16657.html"
    );

    expect(result).toEqual({ error: "Failed to fetch data from Fragrantica" });
  });
});
