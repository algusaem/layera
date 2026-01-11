"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { deletePerfume } from "@/app/actions/admin/deletePerfume";
import { toast } from "sonner";
import { useTransition, useState } from "react";

interface AdminPerfume {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  status: string;
}

interface Props {
  perfume: AdminPerfume;
}

const AdminPerfumeCard = ({ perfume }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePerfume(perfume.id);
      if (result.success) {
        toast.success(`Deleted "${perfume.name}"`);
      } else {
        toast.error(result.error || "Failed to delete");
      }
      setShowConfirm(false);
    });
  };

  const statusBadge = {
    APPROVED: "badge-success",
    PENDING: "badge-warning",
    REJECTED: "badge-error",
  }[perfume.status] || "badge-ghost";

  return (
    <div className="card card-compact bg-base-200/50 border border-base-content/5 hover:border-error/30 transition-all group">
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

        {/* Hover overlay with delete */}
        <div className="absolute inset-0 bg-base-100/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {showConfirm ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium">Delete?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="btn btn-sm btn-error"
                >
                  {isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Yes"
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="btn btn-sm btn-ghost"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn btn-circle btn-error"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </figure>

      <div className="card-body gap-1 grow-0">
        <div className="flex items-center justify-between">
          <p className="text-xs text-secondary/50">{perfume.brand}</p>
          <span className={`badge badge-xs ${statusBadge}`}>
            {perfume.status.toLowerCase()}
          </span>
        </div>
        <h3 className="font-medium text-sm leading-tight line-clamp-2">
          {perfume.name}
        </h3>
      </div>
    </div>
  );
};

export default AdminPerfumeCard;
