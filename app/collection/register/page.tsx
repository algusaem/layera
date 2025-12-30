import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import RegisterForm from "@/components/Collection/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-secondary/60">Start building your fragrance collection</p>
          </div>
          <RegisterForm />
        </SectionContainer>
      </main>
    </div>
  );
}
