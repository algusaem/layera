import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabToggle from "@/components/TabToggle";
import { Home, Settings } from "lucide-react";

describe("TabToggle", () => {
  const tabs = [
    { key: "home", label: "Home", icon: Home },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  it("renders all tabs", () => {
    render(<TabToggle tabs={tabs} selected="home" onChange={jest.fn()} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("highlights selected tab", () => {
    render(<TabToggle tabs={tabs} selected="home" onChange={jest.fn()} />);

    const homeButton = screen.getByRole("button", { name: /home/i });
    expect(homeButton).toHaveClass("bg-accent");
  });

  it("calls onChange when tab is clicked", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TabToggle tabs={tabs} selected="home" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /settings/i }));

    expect(onChange).toHaveBeenCalledWith("settings");
  });

  it("renders tab icons", () => {
    render(<TabToggle tabs={tabs} selected="home" onChange={jest.fn()} />);

    // Icons are rendered as SVG elements
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    buttons.forEach(button => {
      expect(button.querySelector("svg")).toBeInTheDocument();
    });
  });
});
