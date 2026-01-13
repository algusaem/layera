import { sendMessage } from "@/app/actions/chat/sendMessage";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPromptUsage } from "@/app/actions/prompt/getPromptUsage";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");
jest.mock("@/app/actions/prompt/getPromptUsage");
jest.mock("@google/generative-ai");

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetPromptUsage = getPromptUsage as jest.MockedFunction<typeof getPromptUsage>;

// Store original env
const originalEnv = process.env;

describe("sendMessage action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, GEMINI_API_KEY: "test-api-key" };
    mockGetPromptUsage.mockResolvedValue({
      count: 0,
      remaining: 10,
      resetAt: null,
      isLimited: false,
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns error when message is empty", async () => {
    const result = await sendMessage([], "");

    expect(result).toEqual({ error: "Message cannot be empty" });
  });

  it("returns error when message is only whitespace", async () => {
    const result = await sendMessage([], "   ");

    expect(result).toEqual({ error: "Message cannot be empty" });
  });

  it("returns error when API key is not configured", async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await sendMessage([], "Hello");

    expect(result).toEqual({ error: "API key not configured" });
  });

  it("returns rate limit error when user is rate limited", async () => {
    const resetAt = new Date();
    mockGetPromptUsage.mockResolvedValue({
      count: 10,
      remaining: 0,
      resetAt,
      isLimited: true,
    });

    const result = await sendMessage([], "Hello");

    expect(result).toEqual({
      error: "Rate limit exceeded",
      rateLimited: true,
      resetAt,
    });
  });

  it("returns AI response on success", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.findMany.mockResolvedValue([]);

    const result = await sendMessage([], "What perfume do you recommend?");

    expect(result.response).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it("includes user collection in context when authenticated", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.findMany.mockResolvedValue([
      {
        perfume: {
          name: "Sauvage",
          brand: { name: "Dior" },
        },
      },
    ] as never);

    const result = await sendMessage([], "What do you think of my collection?");

    expect(mockPrisma.userPerfume.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      select: {
        perfume: {
          select: {
            name: true,
            brand: { select: { name: true } },
          },
        },
      },
    });
    expect(result.response).toBeDefined();
  });

  it("records prompt usage for logged-in users", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.findMany.mockResolvedValue([]);

    await sendMessage([], "Hello");

    expect(mockPrisma.promptUsage.create).toHaveBeenCalledWith({
      data: { userId: "user-1" },
    });
  });

  it("does not record prompt usage for anonymous users", async () => {
    mockAuth.mockResolvedValue(null);
    mockPrisma.userPerfume.findMany.mockResolvedValue([]);

    await sendMessage([], "Hello");

    expect(mockPrisma.promptUsage.create).not.toHaveBeenCalled();
  });
});
