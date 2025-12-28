import { getAllPerfumesPaginated } from "@/app/actions/getAllPerfumesPaginated";
import Header from "@/components/Collection/Header";
import PerfumeGrid from "@/components/Collection/PerfumeGrid";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Browse({ searchParams }: Props) {
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
          <Header selected="browse" />
          <PerfumeGrid perfumes={perfumes} pagination={pagination} />
        </SectionContainer>
      </main>
    </div>
  );
}
