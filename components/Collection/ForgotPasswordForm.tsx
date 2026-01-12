"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { requestPasswordReset } from "@/app/actions/auth/requestPasswordReset";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const result = await requestPasswordReset(data.email);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-accent/10 p-4 rounded-full w-fit mx-auto">
          <Mail size={32} className="text-accent" />
        </div>
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-secondary/60">
          If an account exists with that email, we&apos;ve sent password reset instructions.
        </p>
        <Link href="/collection/login" className="btn btn-ghost mt-4">
          <ArrowLeft size={18} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Email</legend>
        <input
          type="email"
          placeholder="you@example.com"
          className="input input-bordered w-full"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
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
          "Send Reset Link"
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

export default ForgotPasswordForm;
