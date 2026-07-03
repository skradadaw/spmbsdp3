"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PILIHAN_KELAS, SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";

type Pengumuman = {
  id: string;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  pilihan_kelas: string;
};

export default function PengumumanPage() {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKelas, setFilterKelas] = useState("semua");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/pengumuman");
        if (res.ok) {
          const json = await res.json();
          setData(json.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data pengumuman", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomor_pendaftaran.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKelas = filterKelas === "semua" || item.pilihan_kelas === filterKelas;

    return matchSearch && matchKelas;
  });

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
                <Link href="/cek-status" className="px-3 py-1.5 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary-700)] hover:bg-black/5 rounded-md transition-all">
                  Cek Status
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
                Pengumuman
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-900)] to-[var(--color-primary-600)]">
                Hasil Seleksi Penerimaan Murid Baru
              </h1>
              <p className="text-[var(--color-text-secondary)] font-semibold text-lg md:text-xl mb-2">
                SD Plus 3 Al-Muhajirin <span className="opacity-50 mx-2">|</span> Tahun Ajaran {SITE_CONFIG.academicYear}
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white/50 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden p-6 md:p-10">

                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      label="Pencarian"
                      placeholder="Cari nama atau nomor pendaftaran..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-[250px]">
                    <Select
                      label="Filter Kelas"
                      options={[
                        { value: "semua", label: "Semua Kelas" },
                        ...PILIHAN_KELAS
                      ]}
                      value={filterKelas}
                      onChange={(e) => setFilterKelas(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white/50 rounded-2xl border border-gray-100/80 overflow-x-auto shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <div className="w-10 h-10 border-3 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                      <p>Memuat data pengumuman...</p>
                    </div>
                  ) : filteredData.length > 0 ? (
                    <table className="w-full border-collapse min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="p-4 sm:px-6 text-left border-b border-gray-100 bg-gray-50/50 font-bold text-gray-500 text-xs uppercase tracking-wider">No</th>
                          <th className="p-4 sm:px-6 text-left border-b border-gray-100 bg-gray-50/50 font-bold text-gray-500 text-xs uppercase tracking-wider">Nomor Pendaftaran</th>
                          <th className="p-4 sm:px-6 text-left border-b border-gray-100 bg-gray-50/50 font-bold text-gray-500 text-xs uppercase tracking-wider">Nama Lengkap</th>
                          <th className="p-4 sm:px-6 text-left border-b border-gray-100 bg-gray-50/50 font-bold text-gray-500 text-xs uppercase tracking-wider">Kelas Diterima</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item, index) => {
                          const kelasLabel = PILIHAN_KELAS.find(k => k.value === item.pilihan_kelas)?.label || item.pilihan_kelas;
                          return (
                            <tr key={item.id} className="last:border-b-0 hover:bg-gray-50/50 transition-colors group">
                              <td className="p-4 sm:px-6 border-b border-gray-50 text-gray-500">{index + 1}</td>
                              <td className="p-4 sm:px-6 border-b border-gray-50">
                                <span className="bg-primary-50 group-hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-mono font-bold text-sm border border-primary-100/50 transition-colors">{item.nomor_pendaftaran}</span>
                              </td>
                              <td className="p-4 sm:px-6 border-b border-gray-50 font-bold text-gray-900">
                                {item.nama_lengkap}
                              </td>
                              <td className="p-4 sm:px-6 border-b border-gray-50">
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-sm font-medium">
                                  {kelasLabel}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12 px-4 text-text-secondary">
                      <div className="text-5xl mb-4">📭</div>
                      <h3 className="font-bold text-lg mb-2">Data Tidak Ditemukan</h3>
                      <p>Tidak ada pendaftar yang cocok dengan pencarian Anda.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
