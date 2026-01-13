import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutButton from "@/components/LogoutButton";
import { logout } from "@/app/actions/auth/logout";

jest.mock("@/app/actions/auth/logout");

const mockLogout = logout as jest.MockedFunction<typeof logout>;

describe("LogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logout button", () => {
    render(<LogoutButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls logout action on click", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);
    render(<LogoutButton />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
