import { render, screen } from "@testing-library/react";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  it("renders current page and total pages", () => {
    render(<Pagination page={2} totalPages={5} basePath="/collection" />);

    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("renders correct navigation links", () => {
    render(<Pagination page={2} totalPages={5} basePath="/collection" />);

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/collection?page=1");
    expect(links[1]).toHaveAttribute("href", "/collection?page=3");
  });

  it("disables previous button on first page", () => {
    render(<Pagination page={1} totalPages={5} basePath="/collection" />);

    const prevLink = screen.getAllByRole("link")[0];
    expect(prevLink).toHaveClass("cursor-not-allowed");
  });

  it("disables next button on last page", () => {
    render(<Pagination page={5} totalPages={5} basePath="/collection" />);

    const nextLink = screen.getAllByRole("link")[1];
    expect(nextLink).toHaveClass("cursor-not-allowed");
  });

  it("shows 1 as total when totalPages is 0", () => {
    render(<Pagination page={1} totalPages={0} basePath="/collection" />);

    expect(screen.getByText("1 / 1")).toBeInTheDocument();
  });
});
