"use client";

import { useState, useTransition, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatLoading from "./ChatLoading";
import ChatSuggestions from "./ChatSuggestions";
import { useScrollToBottom } from "./useScrollToBottom";
import { Sparkles, Clock } from "lucide-react";
import { sendMessage } from "@/app/actions/chat/sendMessage";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const formatTimeRemaining = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [rateLimitResetAt, setRateLimitResetAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const scrollContainerRef = useScrollToBottom([messages, isPending]);

  const isRateLimited = rateLimitResetAt !== null && timeRemaining > 0;

  useEffect(() => {
    if (!rateLimitResetAt) return;

    const updateTimer = () => {
      const remaining = rateLimitResetAt.getTime() - Date.now();
      if (remaining <= 0) {
        setRateLimitResetAt(null);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [rateLimitResetAt]);

  const handleSend = (content: string) => {
    if (isRateLimited) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);

    startTransition(async () => {
      const result = await sendMessage(messages, content);

      if (result.rateLimited && result.resetAt) {
        setRateLimitResetAt(new Date(result.resetAt));
        toast.error("You've reached the hourly limit. Please wait.");
        return;
      }

      if (result.error) {
        toast.error(result.error);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response!,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    });
  };

  return (
    <main className="flex flex-col h-[calc(100vh-5rem)] max-w-3xl mx-auto w-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="bg-accent/10 p-4 rounded-full">
              <Sparkles size={32} className="text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Find Your Perfect Scent
              </h2>
              <p className="text-base-content/60">
                For which ocasion are you looking to layer fragrances?
              </p>
            </div>
            <ChatSuggestions onSuggestionClick={handleSend} disabled={isRateLimited} />
          </div>
        ) : (
          <div className="py-8 space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
            {isPending && <ChatLoading />}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-base-100 border-t border-base-content/10 p-4">
        {isRateLimited ? (
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-base-200 rounded-lg text-secondary">
            <Clock size={20} />
            <span>
              Limit reached. Try again in{" "}
              <span className="font-mono font-medium">
                {formatTimeRemaining(timeRemaining)}
              </span>
            </span>
          </div>
        ) : (
          <ChatInput onSend={handleSend} disabled={isPending} />
        )}
      </div>
    </main>
  );
};

export default ChatContainer;
