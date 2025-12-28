import { Plus, Check } from "lucide-react";
import type { Perfume } from "@/types";

type Props = {
  perfume: Perfume;
  inCollection?: boolean;
};

const PerfumeCard = ({ perfume, inCollection = false }: Props) => (
  <div className="card card-compact bg-base-200/50 border border-base-content/5 hover:border-accent/30 transition-all group">
    {/* Image with overlay */}
    <figure className="relative aspect-square bg-base-300/50 rounded-t-xl overflow-hidden">
      <span className="text-secondary/20 text-xs">No image</span>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-base-100/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {inCollection ? (
          <button className="btn btn-circle btn-accent">
            <Check size={20} />
          </button>
        ) : (
          <button className="btn btn-circle btn-accent">
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Collection indicator */}
      {inCollection && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
      )}
    </figure>

    <div className="card-body gap-1">
      <p className="text-xs text-secondary/50">{perfume.brand}</p>
      <h3 className="font-medium text-sm leading-tight">{perfume.name}</h3>
    </div>
  </div>
);

export default PerfumeCard;
