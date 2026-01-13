import { getPromptUsage } from "@/app/actions/prompt/getPromptUsage";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("getPromptUsage action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns default values when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await getPromptUsage();

    expect(result).toEqual({
      count: 0,
      remaining: 10,
      resetAt: null,
      isLimited: false,
    });
    expect(mockPrisma.promptUsage.findMany).not.toHaveBeenCalled();
  });

  it("returns usage count for authenticated users", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.promptUsage.findMany.mockResolvedValue([
      { createdAt: new Date() },
      { createdAt: new Date() },
      { createdAt: new Date() },
    ] as never);

    const result = await getPromptUsage();

    expect(result.count).toBe(3);
    expect(result.remaining).toBe(7);
    expect(result.isLimited).toBe(false);
    expect(result.resetAt).toBeNull();
  });

  it("returns isLimited true when at rate limit", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    const prompts = Array(10).fill({ createdAt: new Date() });
    mockPrisma.promptUsage.findMany.mockResolvedValue(prompts as never);

    const result = await getPromptUsage();

    expect(result.count).toBe(10);
    expect(result.remaining).toBe(0);
    expect(result.isLimited).toBe(true);
    expect(result.resetAt).toBeInstanceOf(Date);
  });

  it("calculates resetAt based on oldest prompt", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    const oldestPromptTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
    const prompts = [
      { createdAt: oldestPromptTime },
      ...Array(9).fill({ createdAt: new Date() }),
    ];
    mockPrisma.promptUsage.findMany.mockResolvedValue(prompts as never);

    const result = await getPromptUsage();

    expect(result.resetAt).toBeDefined();
    // Reset time should be 60 minutes after oldest prompt
    const expectedResetTime = oldestPromptTime.getTime() + 60 * 60 * 1000;
    expect(result.resetAt?.getTime()).toBe(expectedResetTime);
  });

  it("queries prompts within the time window", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.promptUsage.findMany.mockResolvedValue([]);

    await getPromptUsage();

    expect(mockPrisma.promptUsage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: "user-1",
          createdAt: { gte: expect.any(Date) },
        },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      })
    );
  });
});
