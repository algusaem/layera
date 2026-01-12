import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  tabs: Tab[];
  selected: string;
  onChange: (key: string) => void;
}

const TabToggle = ({ tabs, selected, onChange }: Props) => (
  <div className="flex gap-1 bg-base-200/50 p-1 rounded-lg w-full sm:w-fit">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onChange(tab.key)}
        className={clsx(
          "flex-1 sm:flex-none p-2 sm:px-4 sm:py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer",
          selected === tab.key
            ? "bg-accent text-accent-content font-medium"
            : "text-secondary/70 hover:text-secondary hover:bg-base-300/50"
        )}
      >
        <tab.icon size={18} />
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

export default TabToggle;
