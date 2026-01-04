import { Bot } from "lucide-react";

const ChatLoading = () => {
  return (
    <div className="flex gap-4">
      <div className="bg-accent text-accent-content w-8 h-8 rounded-full flex items-center justify-center shrink-0">
        <Bot size={18} />
      </div>

      <div className="max-w-4/5 rounded-xl px-4 py-3 bg-base-200 text-base-content">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default ChatLoading;
