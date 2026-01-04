import { useRef, useEffect } from "react";

export const useScrollToBottom = (dependencies: unknown[]) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  return scrollContainerRef;
};
