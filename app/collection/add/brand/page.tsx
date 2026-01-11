import AddBrandForm from "@/components/Collection/AddBrandForm";
import Header from "@/components/Collection/Header";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddBrand() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <Header selected="add" />
          <Link
            href="/collection/add"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to adding perfume
          </Link>
          <p className="text-secondary/50">
            Add a new brand to the database. Once added, you can use it when
            adding perfumes.
          </p>
          <AddBrandForm />
        </SectionContainer>
      </main>
    </div>
  );
}
