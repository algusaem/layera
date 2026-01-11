interface Props {
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

const suggestions = [
  {
    label: "Date Night",
    prompt: "Create a layering combo for a romantic date night",
  },
  {
    label: "Office",
    prompt: "Recommend a subtle, professional fragrance combo for the office",
  },
  {
    label: "Weekend Casual",
    prompt: "Suggest a fresh, casual layering combo for the weekend",
  },
  {
    label: "Special Event",
    prompt: "Help me create a bold, memorable scent for a special event",
  },
];

const ChatSuggestions = ({ onSuggestionClick, disabled }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.label}
          onClick={() => onSuggestionClick(suggestion.prompt)}
          disabled={disabled}
          className="btn btn-outline btn-accent"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
};

export default ChatSuggestions;
