import { requireAdmin } from "@/app/actions/auth/requireAdmin";
import { getLoginHistory } from "@/app/actions/admin/getLoginHistory";
import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import AdminHeader from "@/components/Admin/AdminHeader";
import LoginHistoryTable from "@/components/Admin/LoginHistoryTable";

export default async function AdminHistory() {
  await requireAdmin();
  const sessions = await getLoginHistory();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <AdminHeader selected="history" />

          {sessions.length > 0 ? (
            <LoginHistoryTable sessions={sessions} />
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary/50">No login history available</p>
              <p className="text-sm text-secondary/40 mt-2">
                User sessions will appear here as they log in
              </p>
            </div>
          )}
        </SectionContainer>
      </main>
    </div>
  );
}
