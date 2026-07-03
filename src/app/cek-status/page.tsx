import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { StatusTracker } from "@/components/status/status-tracker";

export const metadata: Metadata = {
  title: "Cek Status Pendaftaran",
  description: "Cek status pendaftaran Seleksi Penerimaan Murid Baru SD Plus 3 Al-Muhajirin",
};

export default function CekStatusPage() {
  return (
    <div className="min-h-screen relative flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Decorative Background Mesh */}
      <div className="bg-noise"></div>
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }}></div>
      <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-[var(--color-primary-200)] opacity-40 z-0 pointer-events-none animate-float"></div>
      <div className="fixed top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] bg-[var(--color-accent-200)] opacity-30 z-0 pointer-events-none animate-float-delayed"></div>
      <div className="fixed -bottom-[10%] -left-[5%] w-[45%] h-[45%] rounded-full blur-[120px] bg-[var(--color-primary-300)] opacity-20 z-0 pointer-events-none animate-float-slow"></div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Full-width Premium Header */}
        <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm transition-all">
          <div className="w-full max-w-[950px] mx-auto py-3 px-5 md:px-8 flex items-center justify-between">
            {/* Left side: Logo & Navigation */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href="/" className="block group">
                <div className="flex items-center justify-center transition-all group-hover:scale-105 drop-shadow-sm group-hover:drop-shadow-md">
                  <Image src="/images/assets/logo.webp" alt="Logo" width={44} height={44} className="object-contain" priority />
                </div>
              </Link>

              {/* Navigation Menu (Hidden on mobile) */}
              <nav className="hidden md:flex items-center gap-1">
                <Link href="/" className="px-3 py-1.5 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary-700)] hover:bg-black/5 rounded-md transition-all">
                  Beranda
                </Link>
                <Link href="/pendaftaran" className="px-3 py-1.5 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary-700)] hover:bg-black/5 rounded-md transition-all">
                  Pendaftaran
                </Link>
                <Link href="/pengumuman" className="px-3 py-1.5 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary-700)] hover:bg-black/5 rounded-md transition-all">
                  Pengumuman
                </Link>
              </nav>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#128C7E] bg-green-50 hover:bg-green-100 hover:shadow-sm rounded-full transition-all border border-green-200/60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23-7.97,11.95a8,8,0,0,0-.82,8.49,56.28,56.28,0,0,0,23.63,23.63,8,8,0,0,0,8.49-.82l11.95-7.97,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L44,214.66l11.14-33.42a8,8,0,0,0-.67-6.54A88,88,0,1,1,128,216Z"></path></svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-10 md:py-16 flex-1">
          <div className="w-full max-w-[950px] mx-auto px-5 md:px-8">
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 mb-5 px-5 py-2 rounded-full bg-gradient-to-r from-primary-50/80 to-white backdrop-blur-md border border-primary-100/60 shadow-[0_4px_20px_-4px_rgba(0,169,139,0.15)] text-[var(--color-primary-700)] text-sm font-bold uppercase tracking-[0.15em]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </span>
                Cek Status
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-900)] to-[var(--color-primary-600)]">
                Status Pendaftaran SPMB
              </h1>
              <p className="text-[var(--color-text-secondary)] font-semibold text-lg md:text-xl mb-2">
                Masukkan nomor pendaftaran Anda untuk melihat status seleksi saat ini.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white/50 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden p-6 md:p-10">
                <StatusTracker />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
