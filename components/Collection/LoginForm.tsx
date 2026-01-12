"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/app/actions/auth/login";
import Link from "next/link";
import { FlaskConical, LogIn, Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Welcome back!");
    router.push(result.role === "ADMIN" ? "/admin" : "/collection");
  };

  const handleDemoLogin = async () => {
    setValue("email", "test01@layera.com");
    setValue("password", "test123");

    // Submit the form with demo credentials
    await handleSubmit(onSubmit)();
  };

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

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-base">Password</legend>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            className="input input-bordered w-full pr-10"
            {...register("password", { required: "Password is required" })}
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-accent w-full"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>

      <div className="divider text-secondary/40">OR</div>

      <button
        type="button"
        onClick={handleDemoLogin}
        className="btn btn-outline w-full"
      >
        <FlaskConical size={18} />
        Demo Login
      </button>

      <p className="text-center text-sm text-secondary/60">
        Don&apos;t have an account?{" "}
        <Link href="/collection/register" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
