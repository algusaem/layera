"use client";

import { Plus, Check } from "lucide-react";
import { addToCollection } from "@/app/actions/collection/addToCollection";
import { removeFromCollection } from "@/app/actions/collection/removeFromCollection";
import { toast } from "sonner";
import { useTransition } from "react";

type Props = {
  perfumeId: string;
  inCollection: boolean;
};

const AddToCollectionButton = ({ perfumeId, inCollection }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = inCollection
        ? await removeFromCollection(perfumeId)
        : await addToCollection(perfumeId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      const message = inCollection
        ? "Removed from collection"
        : "Added to collection";
      toast.success(message);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="btn btn-circle btn-accent"
    >
      {isPending ? (
        <span className="loading loading-spinner loading-sm" />
      ) : inCollection ? (
        <Check size={20} />
      ) : (
        <Plus size={20} />
      )}
    </button>
  );
};

export default AddToCollectionButton;
