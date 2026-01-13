import { removeFromCollection } from "@/app/actions/collection/removeFromCollection";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createMockSession } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

describe("removeFromCollection action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await removeFromCollection("perfume-1");

    expect(result).toEqual({ error: "You must be logged in" });
    expect(mockPrisma.userPerfume.deleteMany).not.toHaveBeenCalled();
  });

  it("removes perfume from collection successfully", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.deleteMany.mockResolvedValue({ count: 1 });

    const result = await removeFromCollection("perfume-1");

    expect(mockPrisma.userPerfume.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        perfumeId: "perfume-1",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/collection/browse");
    expect(result).toEqual({ success: true });
  });

  it("returns error on database failure", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.deleteMany.mockRejectedValue(new Error("DB Error"));

    const result = await removeFromCollection("perfume-1");

    expect(result).toEqual({ error: "Failed to remove perfume from collection" });
  });
});
