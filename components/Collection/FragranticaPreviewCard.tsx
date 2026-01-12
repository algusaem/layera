"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
}

interface FragranticaData {
  name: string;
  brand: string;
  imageUrl: string;
}

interface Props {
  data: FragranticaData;
  brands: Brand[];
  selectedBrandId: string | null;
  showBrandSelect: boolean;
  isAddingBrand: boolean;
  onAddBrand: () => void;
  onSelectBrand: (brandId: string | null) => void;
  onShowBrandSelect: () => void;
  onClear: () => void;
}

const FragranticaPreviewCard = ({
  data,
  brands,
  selectedBrandId,
  showBrandSelect,
  isAddingBrand,
  onAddBrand,
  onSelectBrand,
  onShowBrandSelect,
  onClear,
}: Props) => {
  const brandExists = brands.find(
    (b) => b.name.toLowerCase() === data.brand.toLowerCase()
  );
  const brandResolved = selectedBrandId !== null;

  return (
    <div className="card card-compact bg-base-200">
      <div className="card-body">
        <div className="flex gap-4">
          <div className="relative w-24 h-32 flex-shrink-0">
            <Image
              src={data.imageUrl}
              alt={data.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{data.name}</h3>
            <p className="text-secondary/70">{data.brand}</p>

            {brandExists || brandResolved ? (
              brandResolved && !brandExists ? (
                <p className="text-success text-sm mt-1">
                  Using: {brands.find((b) => b.id === selectedBrandId)?.name}
                </p>
              ) : null
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-warning text-sm">
                  Brand not found in database
                </p>
                {showBrandSelect ? (
                  <select
                    className="select select-bordered select-sm w-full"
                    value={selectedBrandId || ""}
                    onChange={(e) => onSelectBrand(e.target.value || null)}
                  >
                    <option value="" disabled>
                      Select a brand
                    </option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onAddBrand}
                      disabled={isAddingBrand}
                      className="btn btn-xs btn-accent"
                    >
                      {isAddingBrand ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <>
                          <Plus size={12} />
                          Add &ldquo;{data.brand}&rdquo;
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onShowBrandSelect}
                      className="btn btn-xs btn-ghost"
                    >
                      Select existing
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="btn btn-circle btn-xs btn-ghost"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FragranticaPreviewCard;
