"use client";

import { useTransition } from "react";
import { logout } from "@/app/admin/actions";
import { usePathname } from "next/navigation";

const PATH_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/pendaftar": "Kelola Pendaftar",
  "/admin/pengaturan": "Pengaturan SPMB",
  "/admin/log": "Log Aktivitas",
};

export function AdminHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  
  // Find matching title based on prefix (e.g. /admin/pendaftar/123 -> Kelola Pendaftar)
  const currentTitle = Object.keys(PATH_TITLES).find(key => pathname.startsWith(key)) 
    ? PATH_TITLES[Object.keys(PATH_TITLES).find(key => pathname.startsWith(key))!]
    : "Panel Admin";

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <header className="h-16 bg-bg border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="bg-transparent border-none text-2xl text-text cursor-pointer flex items-center justify-center p-1 lg:hidden" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="text-xl font-bold text-text m-0">{currentTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <span>👤</span>
          <span className="text-sm font-medium text-text">Administrator</span>
        </div>
        <button 
          onClick={handleLogout}
          disabled={isPending}
          className="bg-bg-secondary text-danger-500 border border-border py-1 px-3 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-danger-50 hover:border-danger-200"
          title="Keluar dari Admin Panel"
        >
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </header>
  );
}
