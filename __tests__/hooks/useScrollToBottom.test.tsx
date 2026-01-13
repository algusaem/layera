import { renderHook } from "@testing-library/react";
import { useScrollToBottom } from "@/components/Ask/useScrollToBottom";

describe("useScrollToBottom hook", () => {
  it("returns a ref object", () => {
    const { result } = renderHook(() => useScrollToBottom([1]));

    expect(result.current).toHaveProperty("current");
  });

  it("scrolls to bottom when dependency changes", () => {
    const scrollToMock = jest.fn();
    const mockDiv = {
      scrollTop: 0,
      scrollHeight: 1000,
    };

    const { result, rerender } = renderHook(
      ({ deps }) => useScrollToBottom(deps),
      { initialProps: { deps: [1] } }
    );

    // Simulate assigning the ref
    Object.defineProperty(result.current, "current", {
      value: mockDiv,
      writable: true,
    });

    // Trigger the effect by changing dependencies
    rerender({ deps: [2] });

    // The scrollTop should be set to scrollHeight
    expect(mockDiv.scrollTop).toBe(mockDiv.scrollHeight);
  });

  it("does not error when ref is null", () => {
    const { rerender } = renderHook(
      ({ deps }) => useScrollToBottom(deps),
      { initialProps: { deps: [1] } }
    );

    // Should not throw when re-rendering with null ref
    expect(() => rerender({ deps: [2] })).not.toThrow();
  });
});
