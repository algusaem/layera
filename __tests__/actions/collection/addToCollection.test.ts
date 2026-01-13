import { addToCollection } from "@/app/actions/collection/addToCollection";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createMockSession, createMockUserPerfume } from "../../utils/factories";

jest.mock("@/lib/auth");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

describe("addToCollection action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await addToCollection("perfume-1");

    expect(result).toEqual({ error: "You must be logged in to add perfumes to your collection" });
    expect(mockPrisma.userPerfume.create).not.toHaveBeenCalled();
  });

  it("adds perfume to collection successfully", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.create.mockResolvedValue(createMockUserPerfume());

    const result = await addToCollection("perfume-1");

    expect(mockPrisma.userPerfume.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        perfumeId: "perfume-1",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/collection/browse");
    expect(result).toEqual({ success: true });
  });

  it("returns error on database failure", async () => {
    mockAuth.mockResolvedValue(createMockSession());
    mockPrisma.userPerfume.create.mockRejectedValue(new Error("DB Error"));

    const result = await addToCollection("perfume-1");

    expect(result).toEqual({ error: "Failed to add perfume to collection" });
  });
});
