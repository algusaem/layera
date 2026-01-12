import { addPerfume } from "@/app/actions/perfume/addPerfume";
import { addBrand } from "@/app/actions/brand/addBrand";
import { fetchFragranticaData } from "@/app/actions/fragrantica/fetchFragranticaData";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface Brand {
  id: string;
  name: string;
}

interface FragranticaResult {
  name: string;
  brand: string;
  imageUrl: string;
}

interface UseFragranticaImportProps {
  brands: Brand[];
  onBrandAdded: (brand: Brand) => void;
}

export function useFragranticaImport({
  brands,
  onBrandAdded,
}: UseFragranticaImportProps) {
  const router = useRouter();

  const [fragranticaUrl, setFragranticaUrl] = useState("");
  const [fragranticaData, setFragranticaData] =
    useState<FragranticaResult | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showBrandSelect, setShowBrandSelect] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  const handleFetch = async () => {
    if (!fragranticaUrl.trim()) {
      setFetchError("Please enter a Fragrantica URL");
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    const result = await fetchFragranticaData(fragranticaUrl);

    setIsFetching(false);

    if (result.error) {
      setFetchError(result.error);
      return;
    }

    if (result.data) {
      setFragranticaData(result.data);
      toast.success("Data imported from Fragrantica");
    }
  };

  const clearData = () => {
    setFragranticaData(null);
    setFragranticaUrl("");
    setFetchError(null);
    setShowBrandSelect(false);
    setSelectedBrandId(null);
  };

  const handleAddBrand = async () => {
    if (!fragranticaData) return;

    setIsAddingBrand(true);
    const result = await addBrand({ name: fragranticaData.brand });
    setIsAddingBrand(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.brand) {
      onBrandAdded(result.brand);
      setSelectedBrandId(result.brand.id);
      setShowBrandSelect(false);
      toast.success(`Brand "${result.brand.name}" added`);
    }
  };

  const handleSelectBrand = (brandId: string | null) => {
    setSelectedBrandId(brandId);
    if (brandId) setShowBrandSelect(false);
  };

  const handleSubmit = async () => {
    if (!fragranticaData) {
      toast.error("Please import data from Fragrantica first");
      return;
    }

    let brandId = selectedBrandId;

    if (!brandId) {
      const matchingBrand = brands.find(
        (b) => b.name.toLowerCase() === fragranticaData.brand.toLowerCase()
      );

      if (!matchingBrand) {
        toast.error("Please add or select a brand first");
        return;
      }

      brandId = matchingBrand.id;
    }

    setIsSubmitting(true);

    const result = await addPerfume({
      name: fragranticaData.name,
      brandId,
      imageUrl: fragranticaData.imageUrl,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.pending) {
      toast.success("Perfume submitted for review!");
    } else {
      toast.success("Perfume added successfully!");
    }
    router.push("/collection");
  };

  return {
    // State
    fragranticaUrl,
    fragranticaData,
    isFetching,
    isSubmitting,
    fetchError,
    showBrandSelect,
    selectedBrandId,
    isAddingBrand,

    // Actions
    setFragranticaUrl,
    handleFetch,
    handleSubmit,
    handleAddBrand,
    handleSelectBrand,
    setShowBrandSelect,
    clearData,
  };
}
