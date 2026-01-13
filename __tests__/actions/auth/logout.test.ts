import { logout } from "@/app/actions/auth/logout";
import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

jest.mock("@/lib/auth");

const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("logout action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signs out and redirects to login", async () => {
    mockSignOut.mockResolvedValue(undefined);

    await logout();

    expect(mockSignOut).toHaveBeenCalledWith({ redirect: false });
    expect(mockRedirect).toHaveBeenCalledWith("/collection/login");
  });
});
