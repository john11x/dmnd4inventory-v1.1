import ProtectedClient from "@/app/components/ProtectedClient";
import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedClient role="ROLE_ADMIN">
      <div className="flex min-h-[calc(100vh-4rem)] gap-6">
        <AdminSidebar />
        <div className="flex-1">
          <div className="rounded-[32px] border border-white/5 bg-white/5 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedClient>
  );
}
