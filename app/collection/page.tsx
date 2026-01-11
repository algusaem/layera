import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import Header from "@/components/Collection/Header";
import PerfumeCard from "@/components/Collection/PerfumeCard";
import { getUserCollection } from "@/app/actions/collection/getUserCollection";
import { getCollectionCount } from "@/app/actions/collection/getCollectionCount";

export default async function Collection() {
  const [perfumes, count] = await Promise.all([
    getUserCollection(),
    getCollectionCount(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <Header selected="collection" />
          {perfumes.length > 0 ? (
            <>
              <p className="text-secondary/60">
                {count} {count === 1 ? "perfume" : "perfumes"} in your collection
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {perfumes.map((perfume) => (
                  <PerfumeCard key={perfume.id} perfume={perfume} inCollection />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary/50">Your collection is empty</p>
              <p className="text-sm text-secondary/40 mt-2">
                Browse perfumes and add them to your collection
              </p>
            </div>
          )}
        </SectionContainer>
      </main>
    </div>
  );
}
