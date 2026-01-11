"use client";

import { addPerfume } from "@/app/actions/perfume/addPerfume";
import { getBrands } from "@/app/actions/brand/getBrands";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import ImageUpload from "../ImageUpload";

type Brand = {
  id: string;
  name: string;
};

type PerfumeFormData = {
  brandId: string;
  name: string;
};

type FormInputProps = {
  label: string;
  placeholder: string;
  name: keyof PerfumeFormData;
  type?: string;
  register: UseFormRegister<PerfumeFormData>;
  error?: FieldError;
  required?: boolean;
};

const FormInput = ({
  label,
  placeholder,
  name,
  type = "text",
  register,
  error,
  required = true,
}: FormInputProps) => (
  <fieldset className="fieldset">
    <legend className="fieldset-legend text-base">{label}</legend>
    <input
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full"
      {...register(name, required ? { required: `${label} is required` } : {})}
    />
    {error && <p className="text-error text-sm mt-1">{error.message}</p>}
  </fieldset>
);

const AddPerfumeForm = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-md">
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
            <Link href="/collection/add/brand" className="btn bg-base-100 border-base-content/20">
              <Plus className="w-4 h-4" />
            </Link>
          </div>
        </div>
        {errors.brandId && (
          <p className="text-error text-sm mt-1">{errors.brandId.message}</p>
        )}
      </fieldset>

      <FormInput
        label="Perfume Name"
        placeholder="e.g. Sauvage, No. 5, Oud Wood"
        name="name"
        register={register}
        error={errors.name}
      />

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

export default AddPerfumeForm;
