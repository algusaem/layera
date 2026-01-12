"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/app/actions/auth/resetPassword";
import Link from "next/link";
import { KeyRound, Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface Props {
  token: string;
}

const ResetPasswordForm = ({ token }: Props) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            className="input input-bordered w-full pr-10"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-secondary"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Confirm Password</legend>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="input input-bordered w-full pr-10"
            {...register("confirmPassword", {
              required: "Please confirm your password",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-secondary"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
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
