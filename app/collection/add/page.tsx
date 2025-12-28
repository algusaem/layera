import AddPerfumeForm from "@/components/Collection/AddPerfumeForm";
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
          <p className="text-secondary/50 mb-6">
            Add a new perfume to the database. Once added, you and others can
            add it to your collections.
          </p>
          <AddPerfumeForm />
        </SectionContainer>
      </main>
    </div>
  );
}
