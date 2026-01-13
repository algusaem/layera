import { approvePerfume } from "@/app/actions/admin/approvePerfume";
import { requireAdminRole } from "@/app/actions/admin/requireAdminRole";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createMockAdminSession } from "../../utils/factories";

jest.mock("@/app/actions/admin/requireAdminRole");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockRequireAdminRole = requireAdminRole as jest.MockedFunction<typeof requireAdminRole>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

describe("approvePerfume action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAdminRole.mockResolvedValue(createMockAdminSession());
  });

  it("throws when not admin", async () => {
    mockRequireAdminRole.mockRejectedValue(new Error("Unauthorized"));

    await expect(approvePerfume("perfume-1")).rejects.toThrow("Unauthorized");
  });

  it("approves perfume successfully", async () => {
    mockPrisma.perfume.update.mockResolvedValue({ id: "perfume-1", status: "APPROVED" } as never);

    const result = await approvePerfume("perfume-1");

    expect(mockPrisma.perfume.update).toHaveBeenCalledWith({
      where: { id: "perfume-1" },
      data: { status: "APPROVED" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/collection/browse");
    expect(result).toEqual({ success: true });
  });
});
