import Header from "@/components/Collection/Header";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";

const SkeletonCard = () => (
  <div className="card card-compact bg-base-200/50 border border-base-content/5">
    <figure className="aspect-3/4 bg-base-300/50 skeleton" />
    <div className="card-body gap-2 grow-0">
      <div className="h-3 w-16 skeleton" />
      <div className="h-4 w-24 skeleton" />
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <Header selected="browse" />
          <div className="input w-full border-base-content/10 bg-base-200 skeleton h-12" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
