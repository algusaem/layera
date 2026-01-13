import { recordPrompt } from "@/app/actions/prompt/recordPrompt";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("recordPrompt action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await recordPrompt();

    expect(result).toEqual({ error: "Unauthorized" });
    expect(mockPrisma.promptUsage.create).not.toHaveBeenCalled();
  });

  it("records prompt usage for authenticated users", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.promptUsage.create.mockResolvedValue({
      id: "prompt-1",
      userId: "user-1",
      createdAt: new Date(),
    } as never);

    const result = await recordPrompt();

    expect(mockPrisma.promptUsage.create).toHaveBeenCalledWith({
      data: { userId: "user-1" },
    });
    expect(result).toEqual({ success: true });
  });
});
