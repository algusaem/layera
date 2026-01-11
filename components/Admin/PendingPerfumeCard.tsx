"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { approvePerfume, rejectPerfume } from "@/app/actions/admin";
import { toast } from "sonner";
import { useTransition } from "react";

interface PendingPerfume {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  submittedBy: string;
  createdAt: Date;
}

interface Props {
  perfume: PendingPerfume;
}

const PendingPerfumeCard = ({ perfume }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approvePerfume(perfume.id);
      if (result.success) {
        toast.success(`Approved "${perfume.name}"`);
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectPerfume(perfume.id);
      if (result.success) {
        toast.success(`Rejected "${perfume.name}"`);
      }
    });
  };

  return (
    <div className="card card-compact bg-base-200/50 border border-base-content/5 hover:border-accent/30 transition-all group">
      <figure className="relative aspect-3/4 bg-base-300/50 overflow-hidden">
        {perfume.imageUrl ? (
          <Image
            src={perfume.imageUrl}
            alt={perfume.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary/30">
            No image
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-base-100/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="btn btn-circle btn-accent"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className="btn btn-circle btn-error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </figure>

      <div className="card-body gap-1 grow-0">
        <p className="text-xs text-secondary/50">{perfume.brand}</p>
        <h3 className="font-medium text-sm leading-tight line-clamp-2">{perfume.name}</h3>
      </div>
    </div>
  );
};

export default PendingPerfumeCard;
