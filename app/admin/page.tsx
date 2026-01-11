import { requireAdmin } from "@/app/actions/auth";
import { getPendingPerfumes } from "@/app/actions/admin";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import AdminHeader from "@/components/Admin/AdminHeader";
import PendingPerfumeCard from "@/components/Admin/PendingPerfumeCard";

export default async function Admin() {
  await requireAdmin();
  const pendingPerfumes = await getPendingPerfumes();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <AdminHeader selected="review" />

          {pendingPerfumes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pendingPerfumes.map((perfume) => (
                <PendingPerfumeCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary/50">No perfumes pending approval</p>
              <p className="text-sm text-secondary/40 mt-2">
                New submissions from users will appear here
              </p>
            </div>
          )}
        </SectionContainer>
      </main>
    </div>
  );
}
