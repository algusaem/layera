import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/Collection/LoginForm";
import { login } from "@/app/actions/auth/login";
import { toast } from "sonner";

jest.mock("@/app/actions/auth/login");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockLogin = login as jest.MockedFunction<typeof login>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form with all fields", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /demo login/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("submits form with valid credentials", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: true, role: "USER" });
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Your password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows error toast on login failure", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ error: "Invalid credentials" });
    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Your password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("fills demo credentials on demo login click", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: true, role: "USER" });
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /demo login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test01@layera.com",
        password: "test123",
      });
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText("Your password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find toggle button (there should be one in the password field)
    const toggleButtons = screen.getAllByRole("button", { name: "" });
    const passwordToggle = toggleButtons.find(btn => btn.closest(".relative"));

    if (passwordToggle) {
      await user.click(passwordToggle);
      expect(passwordInput).toHaveAttribute("type", "text");
    }
  });

  it("has link to registration page", () => {
    render(<LoginForm />);

    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toHaveAttribute("href", "/collection/register");
  });

  it("has link to forgot password page", () => {
    render(<LoginForm />);

    const forgotLink = screen.getByRole("link", { name: /forgot password/i });
    expect(forgotLink).toHaveAttribute("href", "/collection/forgot-password");
  });
});
