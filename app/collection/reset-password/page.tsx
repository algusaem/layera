import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import ResetPasswordForm from "@/components/Collection/ResetPasswordForm";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPassword({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-md space-y-8">
          {token ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-secondary/60">Enter your new password below</p>
              </div>
              <ResetPasswordForm token={token} />
            </>
          ) : (
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
              <p className="text-secondary/60">
                This password reset link is invalid or has expired.
              </p>
              <Link href="/collection/forgot-password" className="btn btn-accent">
                Request a new link
              </Link>
            </div>
          )}
        </SectionContainer>
      </main>
    </div>
  );
}
