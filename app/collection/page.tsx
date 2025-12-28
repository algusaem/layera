import PerfumeGrid from "@/components/Collection/PerfumeGrid";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import { Search, Plus } from "lucide-react";
import { getAllPerfumesPaginated } from "../actions/getAllPerfumesPaginated";

const Header = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <p className="text-accent uppercase tracking-widest text-sm mb-2">
        Your Fragrances
      </p>
      <h1 className="text-4xl md:text-5xl font-serif italic">Collection</h1>
    </div>

    <button className="btn btn-outline btn-secondary">
      <Plus size={20} />
      Add Perfume
    </button>
  </header>
);

const Tabs = () => (
  <div className="tabs tabs-box tabs-accent w-fit">
    <input
      type="radio"
      name="CollectionTabs"
      className="tab"
      aria-label="Browse Database"
      defaultChecked
    />
    <input
      type="radio"
      name="CollectionTabs"
      className="tab"
      aria-label="My Collection (0)"
    />
  </div>
);

const SearchBar = () => (
  <label className="input w-full border-base-content/10 bg-base-200">
    <Search size={20} className="text-secondary/40" />
    <input type="search" required placeholder="Search" />
  </label>
);

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Collection({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const { perfumes, pagination } = await getAllPerfumesPaginated({
    page,
    limit: 20,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <Header />
          <Tabs />
          <SearchBar />
          <PerfumeGrid perfumes={perfumes} pagination={pagination} />
        </SectionContainer>
      </main>
    </div>
  );
}
