import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToCollectionButton from "@/components/Collection/AddToCollectionButton";
import { addToCollection } from "@/app/actions/collection/addToCollection";
import { removeFromCollection } from "@/app/actions/collection/removeFromCollection";
import { toast } from "sonner";

jest.mock("@/app/actions/collection/addToCollection");
jest.mock("@/app/actions/collection/removeFromCollection");

const mockAddToCollection = addToCollection as jest.MockedFunction<typeof addToCollection>;
const mockRemoveFromCollection = removeFromCollection as jest.MockedFunction<typeof removeFromCollection>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("AddToCollectionButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders add button when not in collection", () => {
    render(<AddToCollectionButton perfumeId="perfume-1" inCollection={false} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn-accent");
  });

  it("renders check icon when in collection", () => {
    render(<AddToCollectionButton perfumeId="perfume-1" inCollection={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls addToCollection when not in collection", async () => {
    const user = userEvent.setup();
    mockAddToCollection.mockResolvedValue({ success: true });
    render(<AddToCollectionButton perfumeId="perfume-1" inCollection={false} />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockAddToCollection).toHaveBeenCalledWith("perfume-1");
      expect(mockToast.success).toHaveBeenCalledWith("Added to collection");
    });
  });

  it("calls removeFromCollection when in collection", async () => {
    const user = userEvent.setup();
    mockRemoveFromCollection.mockResolvedValue({ success: true });
    render(<AddToCollectionButton perfumeId="perfume-1" inCollection={true} />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockRemoveFromCollection).toHaveBeenCalledWith("perfume-1");
      expect(mockToast.success).toHaveBeenCalledWith("Removed from collection");
    });
  });

  it("shows error toast on failure", async () => {
    const user = userEvent.setup();
    mockAddToCollection.mockResolvedValue({ error: "Must be logged in" });
    render(<AddToCollectionButton perfumeId="perfume-1" inCollection={false} />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Must be logged in");
    });
  });
});
