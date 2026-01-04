import clsx from "clsx";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Props = {
  role: "user" | "assistant";
  content: string;
};

const ChatMessage = ({ role, content }: Props) => {
  const isUser = role === "user";

  return (
    <div className={clsx("flex gap-4", { "justify-end": isUser })}>
      {!isUser && (
        <div className="bg-accent text-accent-content w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <Bot size={18} />
        </div>
      )}

      <div
        className={clsx(
          "max-w-4/5 rounded-xl px-4 py-3",
          isUser
            ? "bg-accent text-accent-content"
            : "bg-base-200 text-base-content"
        )}
      >
        <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
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
