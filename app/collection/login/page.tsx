import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/Collection/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-secondary/60">Sign in to access your collection</p>
          </div>
          <LoginForm />
        </SectionContainer>
      </main>
    </div>
  );
}
