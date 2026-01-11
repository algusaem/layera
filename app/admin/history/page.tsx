import { requireAdmin } from "@/app/actions/auth";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import AdminHeader from "@/components/Admin/AdminHeader";

export default async function AdminHistory() {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <AdminHeader selected="history" />

          <div className="text-center py-12">
            <p className="text-secondary/50">Log history coming soon</p>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
