import Header from "@/components/Collection/Header";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";

export default function Add() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <Header selected="add" />
          <p>Add perfume</p>
        </SectionContainer>
      </main>
    </div>
  );
}
