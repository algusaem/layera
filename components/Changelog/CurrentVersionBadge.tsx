import { Sparkles } from "lucide-react";

interface CurrentVersionBadgeProps {
  version: string;
}

const CurrentVersionBadge = ({ version }: CurrentVersionBadgeProps) => (
  <div className="flex justify-center mb-12">
    <div className="badge badge-lg badge-accent gap-2">
      <Sparkles size={14} />
      Current Version: {version}
    </div>
  </div>
);

export default CurrentVersionBadge;
