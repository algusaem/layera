import SectionContainer from "@/components/Main/SectionContainer";
import Navbar from "@/components/Navbar";
import AdminHeader from "@/components/Admin/AdminHeader";

const SkeletonRow = () => (
  <tr>
    <td>
      <div className="space-y-2">
        <div className="h-4 w-24 skeleton" />
        <div className="h-3 w-32 skeleton" />
      </div>
    </td>
    <td><div className="h-4 w-20 skeleton" /></td>
    <td><div className="h-4 w-20 skeleton" /></td>
    <td><div className="h-5 w-14 skeleton rounded-full" /></td>
  </tr>
);

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full flex items-center flex-col">
        <SectionContainer className="max-w-6xl space-y-8">
          <AdminHeader selected="history" />
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="text-secondary/70">
                  <th>User</th>
                  <th>Login Time</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
