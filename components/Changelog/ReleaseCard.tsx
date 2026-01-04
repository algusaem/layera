import { Calendar } from "lucide-react";
import type { Release } from "./types";
import ChangeItem from "./ChangeItem";

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard = ({ release }: ReleaseCardProps) => (
  <div className="card bg-base-200 border border-base-content/10">
    <div className="card-body">
      {/* Release Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="card-title text-2xl font-display">v{release.version}</h2>
        <div className="flex items-center gap-2 text-sm text-secondary/60">
          <Calendar size={16} />
          {new Date(release.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Changes */}
      <div className="space-y-3">
        {release.changes.map((change, idx) => (
          <ChangeItem key={idx} change={change} />
        ))}
      </div>
    </div>
  </div>
);

export default ReleaseCard;
