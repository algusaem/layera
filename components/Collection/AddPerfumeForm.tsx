"use client";

import { addPerfume } from "@/app/actions/addPerfume";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import ImageUpload from "../ImageUpload";

type PerfumeFormData = {
  brand: string;
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

    toast.success("Perfume added successfully!");
    router.push("/collection");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-md">
      <FormInput
        label="Brand"
        placeholder="e.g. Dior, Chanel, Tom Ford"
        name="brand"
        register={register}
        error={errors.brand}
      />

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
