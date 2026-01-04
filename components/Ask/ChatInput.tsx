"use client";

import { Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSend, disabled = false }: Props) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything about fragrance layering..."
        disabled={disabled}
        className="input input-bordered flex-1"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="btn btn-accent"
      >
        {disabled ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <Send size={18} />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
