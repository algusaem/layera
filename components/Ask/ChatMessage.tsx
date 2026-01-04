import { Bot, User } from "lucide-react";

type Props = {
  role: "user" | "assistant";
  content: string;
};

const ChatMessage = ({ role, content }: Props) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="bg-accent text-accent-content w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-accent text-accent-content"
            : "bg-base-200 text-base-content"
        }`}
      >
        <p className="text-sm leading-relaxed">{content}</p>
      </div>

      {isUser && (
        <div className="bg-base-300 text-base-content w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
