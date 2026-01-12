import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import ForgotPasswordForm from "@/components/Collection/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Forgot your password?</h1>
            <p className="text-secondary/60">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>
          <ForgotPasswordForm />
        </SectionContainer>
      </main>
    </div>
  );
}
