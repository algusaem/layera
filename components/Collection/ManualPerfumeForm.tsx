"use client";

import { addPerfume } from "@/app/actions/perfume/addPerfume";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import ImageUpload from "../ImageUpload";

interface Brand {
  id: string;
  name: string;
}

interface PerfumeFormData {
  brandId: string;
  name: string;
}

interface Props {
  brands: Brand[];
}

const ManualPerfumeForm = ({ brands }: Props) => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfumeFormData>();

  const onSubmit = async (data: PerfumeFormData) => {
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append("image", imageFile);

    const result = await addPerfume(data, imageFormData);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Brand</legend>
        <div className="flex gap-2">
          <select
            className="select select-bordered flex-1"
            {...register("brandId", { required: "Brand is required" })}
            defaultValue=""
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
          <div className="tooltip tooltip-accent" data-tip="Add new brand">
            <Link
              href="/collection/add/brand"
              className="btn bg-base-100 border-base-content/20"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
        </div>
        {errors.brandId && (
          <p className="text-error text-sm mt-1">{errors.brandId.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Perfume Name</legend>
        <input
          type="text"
          placeholder="e.g. Sauvage, No. 5, Oud Wood"
          className="input input-bordered w-full"
          {...register("name", { required: "Perfume name is required" })}
        />
        {errors.name && (
          <p className="text-error text-sm mt-1">{errors.name.message}</p>
        )}
      </fieldset>

      <ImageUpload onFileChange={setImageFile} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-accent w-full mt-2"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Add Perfume"
        )}
      </button>
    </form>
  );
};

export default ManualPerfumeForm;
