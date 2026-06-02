import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40"> {/* Dùng bg-muted/40 cho nó phân tách màu rõ ràng hơn */}
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="flex-1 p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}