"use client";

import { addPerfume } from "@/app/actions/addPerfume";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormData = {
  brand: string;
  name: string;
  imageUrl?: string;
};

type FormInputProps = {
  label: string;
  placeholder: string;
  name: keyof FormData;
  type?: string;
  register: UseFormRegister<FormData>;
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const result = await addPerfume(data);

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

      <FormInput
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        name="imageUrl"
        type="url"
        register={register}
        required={false}
      />

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
