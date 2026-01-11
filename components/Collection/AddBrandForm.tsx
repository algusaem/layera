"use client";

import { addBrand } from "@/app/actions/addBrand";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BrandFormData {
  name: string;
}

const AddBrandForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>();

  const onSubmit = async (data: BrandFormData) => {
    const result = await addBrand(data);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Brand added successfully!");
    router.push("/collection/add");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Brand Name</legend>
        <input
          type="text"
          placeholder="e.g. Dior, Chanel, Tom Ford"
          className="input input-bordered w-full"
          {...register("name", { required: "Brand name is required" })}
        />
        {errors.name && (
          <p className="text-error text-sm mt-1">{errors.name.message}</p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-accent w-full"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Add Brand"
        )}
      </button>
    </form>
  );
};

export default AddBrandForm;
