import type { Change } from "./types";
import { changeTypeConfig } from "./changeTypeConfig";

interface ChangeItemProps {
  change: Change;
}

const ChangeItem = ({ change }: ChangeItemProps) => {
  const config = changeTypeConfig[change.type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-base-100 border border-base-content/5">
      <div className={`mt-0.5 ${config.color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}
          >
            {config.label}
          </span>
        </div>
        <p className="text-sm text-secondary/80">{change.description}</p>
      </div>
    </div>
  );
};

export default ChangeItem;
