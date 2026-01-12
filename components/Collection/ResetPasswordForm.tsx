"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/app/actions/auth/resetPassword";
import Link from "next/link";
import { KeyRound } from "lucide-react";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface Props {
  token: string;
}

const ResetPasswordForm = ({ token }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await resetPassword({ token, password: data.password });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Password reset successfully!");
    router.push("/collection/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">New Password</legend>
        <input
          type="password"
          placeholder="At least 6 characters"
          className="input input-bordered w-full"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Confirm Password</legend>
        <input
          type="password"
          placeholder="Confirm your password"
          className="input input-bordered w-full"
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
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
          <>
            <KeyRound size={18} />
            Reset Password
          </>
        )}
      </button>

      <p className="text-center text-sm text-secondary/60">
        Remember your password?{" "}
        <Link href="/collection/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
