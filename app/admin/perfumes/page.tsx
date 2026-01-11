import { requireAdmin } from "@/app/actions/auth/requireAdmin";
import { getAllPerfumesAdmin } from "@/app/actions/admin/getAllPerfumesAdmin";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import AdminHeader from "@/components/Admin/AdminHeader";
import AdminPerfumeCard from "@/components/Admin/AdminPerfumeCard";
import Pagination from "@/components/Pagination";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminPerfumes({ searchParams }: Props) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10));

  const { perfumes, pagination } = await getAllPerfumesAdmin({ page, limit: 20 });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <AdminHeader selected="perfumes" />

          <p className="text-secondary/60">
            {pagination.total} {pagination.total === 1 ? "perfume" : "perfumes"} total
          </p>

          {perfumes.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {perfumes.map((perfume) => (
                  <AdminPerfumeCard key={perfume.id} perfume={perfume} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                basePath="/admin/perfumes"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary/50">No perfumes in the database</p>
            </div>
          )}
        </SectionContainer>
      </main>
    </div>
  );
}
