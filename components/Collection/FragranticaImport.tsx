"use client";

import { useFragranticaImport } from "@/hooks/useFragranticaImport";
import FragranticaPreviewCard from "./FragranticaPreviewCard";

interface Brand {
  id: string;
  name: string;
}

interface Props {
  brands: Brand[];
  onBrandAdded: (brand: Brand) => void;
}

const FragranticaImport = ({ brands, onBrandAdded }: Props) => {
  const {
    fragranticaUrl,
    fragranticaData,
    isFetching,
    isSubmitting,
    fetchError,
    showBrandSelect,
    selectedBrandId,
    isAddingBrand,
    setFragranticaUrl,
    handleFetch,
    handleSubmit,
    handleAddBrand,
    handleSelectBrand,
    setShowBrandSelect,
    clearData,
  } = useFragranticaImport({ brands, onBrandAdded });

  if (fragranticaData) {
    return (
      <div className="space-y-4">
        <FragranticaPreviewCard
          data={fragranticaData}
          brands={brands}
          selectedBrandId={selectedBrandId}
          showBrandSelect={showBrandSelect}
          isAddingBrand={isAddingBrand}
          onAddBrand={handleAddBrand}
          onSelectBrand={handleSelectBrand}
          onShowBrandSelect={() => setShowBrandSelect(true)}
          onClear={clearData}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn btn-accent w-full"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Add Perfume"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Fragrantica URL</legend>
        <input
          type="url"
          value={fragranticaUrl}
          onChange={(e) => setFragranticaUrl(e.target.value)}
          placeholder="https://www.fragrantica.com/perfume/..."
          className="input input-bordered w-full"
        />
        {fetchError && (
          <p className="text-error text-sm mt-1">{fetchError}</p>
        )}
      </fieldset>

      <button
        type="button"
        onClick={handleFetch}
        disabled={isFetching}
        className="btn btn-accent w-full"
      >
        {isFetching ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Import from Fragrantica"
        )}
      </button>
    </div>
  );
};

export default FragranticaImport;
