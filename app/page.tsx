import Divider from "@/components/Divider";
import IntroSection from "@/components/Main/IntroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen">
      <Navbar />

      <main className="w-full flex items-center flex-col">
        <IntroSection />
        <Divider />
      </main>
    </div>
  );
}
