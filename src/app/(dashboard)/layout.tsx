import { Sidebar } from "@/components/dashboard/Shared/Sidebar";
import { Topbar } from "@/components/dashboard/Shared/Topbar";
import getProfile from "@/utils/getProfile";

export default async function  DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const profile = await getProfile();
  return (
    <div className="flex h-screen bg-[#111111] overflow-hidden">
      <Sidebar profile={profile}/>
      <main className="flex-1 overflow-y-auto bg-linear-to-br from-black via-[#0A0A0A] to-black">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
