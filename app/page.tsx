import Divider from "@/components/Divider";
import BadgeSection from "@/components/Main/BadgeSection/BadgeSection";
import HowItWorksSection from "@/components/Main/HowItWorksSection";
import IntroSection from "@/components/Main/IntroSection";
import OpenSourceSection from "@/components/Main/OpenSourceSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="w-full flex items-center flex-col">
        <IntroSection />
        <Divider />
        <BadgeSection />
        <Divider />
        <HowItWorksSection />
        <Divider />
        <OpenSourceSection />
      </main>
    </div>
  );
}
