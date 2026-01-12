"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface FragranticaData {
  name: string;
  brand: string;
  imageUrl: string;
}

interface FetchResult {
  data?: FragranticaData;
  error?: string;
}

function parseFragranticaUrl(url: string): { brand: string; name: string; id: string } | null {
  // Fragrantica URLs follow the pattern:
  // https://www.fragrantica.com/perfume/Brand-Name/Perfume-Name-12345.html
  // Examples:
  // https://www.fragrantica.com/perfume/Versace/Eros-16657.html
  // https://www.fragrantica.com/perfume/Maison-Francis-Kurkdjian/Baccarat-Rouge-540-33519.html

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    // Expected: ["perfume", "Brand-Name", "Perfume-Name-12345.html"]
    if (pathParts.length < 3 || pathParts[0] !== "perfume") {
      return null;
    }

    const brand = pathParts[1].replace(/-/g, " ");
    const perfumeSlug = pathParts[2];

    // Extract ID and name from "Perfume-Name-12345.html"
    const match = perfumeSlug.match(/^(.+)-(\d+)\.html$/i);
    if (!match) {
      return null;
    }

    const name = match[1].replace(/-/g, " ");
    const id = match[2];

    return { brand, name, id };
  } catch {
    return null;
  }
}

export async function fetchFragranticaData(url: string): Promise<FetchResult> {
  // Validate URL is from Fragrantica
  if (!url.includes("fragrantica.com")) {
    return { error: "URL must be from fragrantica.com" };
  }

  const parsed = parseFragranticaUrl(url);

  if (!parsed) {
    return { error: "Invalid Fragrantica URL format" };
  }

  try {
    // Construct the direct image URL from fimgs.net
    const imageSourceUrl = `https://fimgs.net/mdimg/perfume-thumbs/375x500.${parsed.id}.jpg`;

    // Download the image
    const imageResponse = await fetch(imageSourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": "https://www.fragrantica.com/",
      },
    });

    if (!imageResponse.ok) {
      return { error: `Failed to download image: ${imageResponse.status}` };
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "layera/perfumes",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        )
        .end(buffer);
    });

    return {
      data: {
        name: parsed.name,
        brand: parsed.brand,
        imageUrl: result.secure_url,
      },
    };
  } catch (error) {
    console.error("Fragrantica fetch error:", error);
    return { error: "Failed to fetch data from Fragrantica" };
  }
}
