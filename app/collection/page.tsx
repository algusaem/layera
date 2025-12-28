import PerfumeCard from "@/components/Collection/PerfumeCard";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import { Search, Plus } from "lucide-react";

const mockPerfumes = [
  { id: "1", name: "Bleu de Chanel", brand: "Chanel" },
  { id: "2", name: "Allure Homme Sport", brand: "Chanel" },
  { id: "3", name: "Dior Homme", brand: "Dior" },
  { id: "4", name: "Sauvage", brand: "Dior" },
  { id: "5", name: "Aventus", brand: "Creed" },
  { id: "6", name: "Green Irish Tweed", brand: "Creed" },
];

const Header = () => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <p className="text-accent uppercase tracking-widest text-sm mb-2">
        Your Fragrances
      </p>
      <h1 className="text-4xl md:text-5xl font-serif italic">Collection</h1>
    </div>

    <button className="btn btn-outline">
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

const Grid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {mockPerfumes.map((perfume) => (
      <PerfumeCard key={perfume.id} perfume={perfume} />
    ))}
  </div>
);

export default function Collection() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <Header />
          <Tabs />
          <SearchBar />
          <Grid />
        </SectionContainer>
      </main>
    </div>
  );
}
