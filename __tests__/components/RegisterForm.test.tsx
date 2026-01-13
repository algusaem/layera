import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/components/Collection/RegisterForm";
import { register as registerUser } from "@/app/actions/auth/register";
import { toast } from "sonner";

jest.mock("@/app/actions/auth/register");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockRegister = registerUser as jest.MockedFunction<typeof registerUser>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders registration form with all fields", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("At least 6 characters")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("At least 6 characters"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "password456");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Passwords do not match");
    });
  });

  it("shows error for password too short", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("At least 6 characters"), "12345");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "12345");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText("Your name"), "John Doe");
    await user.type(screen.getByPlaceholderText("you@example.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("At least 6 characters"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
        name: "John Doe",
      });
    });
  });

  it("shows error toast on registration failure", async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ error: "Email already exists" });
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "existing@example.com");
    await user.type(screen.getByPlaceholderText("At least 6 characters"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Email already exists");
    });
  });

  it("has link to login page", () => {
    render(<RegisterForm />);

    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink).toHaveAttribute("href", "/collection/login");
  });
});
