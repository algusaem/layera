import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBrandForm from "@/components/Collection/AddBrandForm";
import { addBrand } from "@/app/actions/brand/addBrand";
import { toast } from "sonner";

jest.mock("@/app/actions/brand/addBrand");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockAddBrand = addBrand as jest.MockedFunction<typeof addBrand>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("AddBrandForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders brand form with input and submit button", () => {
    render(<AddBrandForm />);

    expect(screen.getByPlaceholderText("e.g. Dior, Chanel, Tom Ford")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add brand/i })).toBeInTheDocument();
  });

  it("shows validation error when name is empty", async () => {
    const user = userEvent.setup();
    render(<AddBrandForm />);

    await user.click(screen.getByRole("button", { name: /add brand/i }));

    await waitFor(() => {
      expect(screen.getByText("Brand name is required")).toBeInTheDocument();
    });
  });

  it("submits form with valid brand name", async () => {
    const user = userEvent.setup();
    mockAddBrand.mockResolvedValue({ success: true, brand: { id: "1", name: "Dior" } });
    render(<AddBrandForm />);

    await user.type(screen.getByPlaceholderText("e.g. Dior, Chanel, Tom Ford"), "Dior");
    await user.click(screen.getByRole("button", { name: /add brand/i }));

    await waitFor(() => {
      expect(mockAddBrand).toHaveBeenCalledWith({ name: "Dior" });
      expect(mockToast.success).toHaveBeenCalledWith("Brand added successfully!");
    });
  });

  it("shows error toast when brand already exists", async () => {
    const user = userEvent.setup();
    mockAddBrand.mockResolvedValue({ error: 'Brand "Dior" already exists' });
    render(<AddBrandForm />);

    await user.type(screen.getByPlaceholderText("e.g. Dior, Chanel, Tom Ford"), "Dior");
    await user.click(screen.getByRole("button", { name: /add brand/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Brand "Dior" already exists');
    });
  });
});
