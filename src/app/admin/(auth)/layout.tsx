import { CmsSidebar } from "@/components/admin/CmsSidebar";
import { CmsTopBar } from "@/components/admin/CmsTopBar";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f1f3f2] font-sans text-slate-900">
      <CmsSidebar />
      <div className="min-h-screen md:ml-[260px]">
        <CmsTopBar />
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
