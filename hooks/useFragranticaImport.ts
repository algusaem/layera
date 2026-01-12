import { addPerfume } from "@/app/actions/perfume/addPerfume";
import { getOrCreateBrand } from "@/app/actions/brand/getOrCreateBrand";
import { checkPerfumeExists } from "@/app/actions/perfume/checkPerfumeExists";
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

    if (result.error) {
      setIsFetching(false);
      setFetchError(result.error);
      return;
    }

    if (result.data) {
      // Check if perfume already exists
      const existsResult = await checkPerfumeExists(result.data.name);

      setIsFetching(false);

      if (existsResult.exists && existsResult.perfume) {
        setFetchError(
          `"${existsResult.perfume.name}" already exists (by ${existsResult.perfume.brand})`
        );
        return;
      }

      setFragranticaData(result.data);
      toast.success("Data imported from Fragrantica");
    } else {
      setIsFetching(false);
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
    const result = await getOrCreateBrand(fragranticaData.brand);
    setIsAddingBrand(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.brand) {
      onBrandAdded(result.brand);
      setSelectedBrandId(result.brand.id);
      setShowBrandSelect(false);

      if (result.created) {
        toast.success(`Brand "${result.brand.name}" added`);
      } else {
        toast.success(`Using existing brand "${result.brand.name}"`);
      }
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
