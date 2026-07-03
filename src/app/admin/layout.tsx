import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - SPMB SD Plus 3 Al-Muhajirin",
  description: "Panel administrasi pendaftaran siswa baru",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
