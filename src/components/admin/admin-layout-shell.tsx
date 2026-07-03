"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { 
  ChartBar, 
  Users, 
  Gear, 
  FileText, 
  SignOut, 
  Buildings, 
  Eye, 
  List, 
  X 
} from "@phosphor-icons/react";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: ChartBar },
    { label: "Pendaftar", href: "/admin/pendaftar", icon: Users },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin/dashboard" className="flex items-center gap-3 no-underline">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-[var(--color-primary-600)] shrink-0 shadow-sm border border-[var(--color-border-light)] overflow-hidden">
              <Image src="/images/assets/logo.webp" alt="Logo" width={40} height={40} className="object-contain" priority />
            </div>
            <div className="flex flex-col justify-center">
              <span className="block font-extrabold text-[1.125rem] text-[var(--color-primary-900)] leading-tight">Admin Portal</span>
            </div>
          </Link>
          <button 
            className="mobile-toggle"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="text-[0.75rem] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2 pl-4">Menu Utama</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} weight={isActive ? "fill" : "duotone"} className={isActive ? "text-[var(--color-primary-600)]" : "text-[var(--color-text-muted)]"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer flex flex-col gap-1">
          <Link 
            href="/admin/pengaturan"
            className={`admin-nav-item ${pathname.includes('/pengaturan') ? "active" : ""}`}
          >
            <Gear size={20} weight={pathname.includes('/pengaturan') ? "fill" : "duotone"} className={pathname.includes('/pengaturan') ? "text-[var(--color-primary-600)]" : "text-[var(--color-text-muted)]"} />
            Pengaturan
          </Link>
          <Link 
            href="/admin/log"
            className={`admin-nav-item ${pathname.includes('/log') ? "active" : ""}`}
          >
            <FileText size={20} weight={pathname.includes('/log') ? "fill" : "duotone"} className={pathname.includes('/log') ? "text-[var(--color-primary-600)]" : "text-[var(--color-text-muted)]"} />
            Log Aktivitas
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-danger-600)] bg-transparent hover:bg-[var(--color-danger-50)] transition-colors duration-200"
          >
            <SignOut size={20} weight="duotone" />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-header">
          <div className="flex items-center gap-4">
            <button 
              className="mobile-toggle"
              onClick={() => setIsSidebarOpen(true)}
            >
              <List size={20} />
            </button>
            <h2 className="text-base font-bold text-[var(--color-text)] m-0">
              {pathname === '/admin/dashboard' ? 'Dashboard' : 
               pathname.includes('/pendaftar') ? 'Data Pendaftar' : 
               pathname.includes('/pengaturan') ? 'Pengaturan' : 'Log Aktivitas'}
            </h2>
          </div>
          <div>
            <Link 
              href="/pendaftaran" 
              target="_blank"
              className="btn btn-secondary btn-sm rounded-lg"
            >
              <Eye size={18} weight="duotone" /> <span>Form Pendaftaran</span>
            </Link>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-content-inner animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

