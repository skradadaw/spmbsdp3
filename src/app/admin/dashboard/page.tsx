"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardMetrics } from "./actions";
import { 
  Users,
  CheckCircle, 
  GraduationCap, 
  XCircle, 
  Hourglass, 
  FileText, 
  Sparkle, 
  Backpack, 
  BookOpen, 
  Globe, 
  GenderMale, 
  GenderFemale,
  ArrowRight
} from "@phosphor-icons/react";

const KUOTA_SISWA = 130;

// -- Modern Minimalism Components --
function CardTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <h2 className={`text-lg font-bold text-[var(--color-text)] tracking-tight ${className}`}>{children}</h2>;
}

// --------------------------------------

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardMetrics().then((res) => {
      if (res.error) setError(res.error);
      else setMetrics(res.data);
    });
  }, []);

  const diterima = metrics?.diterima || 0;
  const totalMasuk = metrics?.total || 0;
  const lolosVerifikasi = (metrics?.dokumen_lengkap || 0) + (metrics?.pembayaran_terkonfirmasi || 0) + (metrics?.terjadwal_okb || 0) + (metrics?.diterima || 0) + (metrics?.tidak_diterima || 0);

  const menungguVerif = metrics?.menunggu_verifikasi || 0;
  const menungguRevisi = metrics?.dokumenDitolakCount || 0;

  const regulerCount = metrics?.pendaftar_reguler || 0;
  const tahfidzCount = metrics?.pendaftar_tahfidz || 0;
  const bahasaCount = metrics?.pendaftar_bahasa || 0;
  
  const lakiLaki = metrics?.diterima_l || 0;
  const perempuan = metrics?.diterima_p || 0;
  const totalGender = lakiLaki + perempuan;

  return (
    <div className="flex flex-col min-h-screen gap-6 p-4 md:p-6 lg:p-8 bg-[var(--color-bg)]">
      
      {error && (
        <div className="p-4 bg-[var(--color-danger-50)] text-[var(--color-danger-700)] rounded-xl border border-[var(--color-danger-200)] flex gap-3 items-center text-sm font-medium shadow-sm">
          <XCircle size={20} weight="duotone" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. TOP ROW: KPI CARDS (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        
        {/* KPI 1: Total Pendaftar */}
        <div className="card card-elevated !p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Total Pendaftar</h3>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users size={22} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">{totalMasuk}</span>
            </div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1.5 flex items-center gap-1">
              Target: <strong className="text-[var(--color-primary-600)]">{KUOTA_SISWA} Siswa</strong>
            </p>
          </div>
        </div>

        {/* KPI 2: Resmi Diterima */}
        <div className="card card-elevated !p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Resmi Diterima</h3>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-success-50)] text-[var(--color-success-600)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GraduationCap size={22} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">{diterima}</span>
            </div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1.5 flex items-center gap-1">
              Lulus keseluruhan tes
            </p>
          </div>
        </div>

        {/* KPI 3: Perlu Revisi */}
        <div className="card card-elevated !p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Perlu Revisi</h3>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-warning-50)] text-[var(--color-warning-600)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText size={22} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">{menungguRevisi}</span>
            </div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1.5 flex items-center gap-1">
              Berkas belum direvisi / tidak lengkap
            </p>
          </div>
        </div>

        {/* KPI 4: Mengundurkan Diri */}
        <div className="card card-elevated !p-5 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Mengundurkan Diri</h3>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-danger-50)] text-[var(--color-danger-600)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <XCircle size={22} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">{metrics?.tidak_diterima || 0}</span>
            </div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mt-1.5 flex items-center gap-1">
              Batal / Tidak lulus
            </p>
          </div>
        </div>

      </div>

      {/* 2. MAIN CONTENT ROW (8:4 Split on Large Screens) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        
        {/* LEFT COLUMN: Action Tasks (Takes 8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <section className="card card-elevated flex flex-col h-full !p-6 lg:!p-8">
            <div className="flex justify-between items-center mb-6">
              <CardTitle>Tugas yang Memerlukan Tindakan</CardTitle>
            </div>

            {menungguVerif === 0 && menungguRevisi === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center bg-[var(--color-bg)] rounded-xl border border-dashed border-[var(--color-border)] p-12">
                <Sparkle size={48} weight="duotone" className="text-[var(--color-primary-400)] mb-4" />
                <p className="text-lg font-bold text-[var(--color-text)] tracking-tight">Semua Tugas Selesai</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 font-medium max-w-sm mx-auto">
                  Tidak ada dokumen pendaftar yang memerlukan validasi atau pemeriksaan saat ini.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-1">
                {menungguVerif > 0 && (
                  <Link href="/admin/pendaftar" className="group flex items-center gap-5 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent-300)] hover:bg-[var(--color-accent-50)] transition-all duration-200">
                    <div className="w-12 h-12 flex-shrink-0 bg-[var(--color-accent-100)] text-[var(--color-accent-600)] rounded-xl flex items-center justify-center relative">
                      <Hourglass size={24} weight="duotone" />
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[var(--color-accent-600)] text-white text-xs font-black rounded-lg flex items-center justify-center ring-2 ring-white shadow-sm">
                        {menungguVerif}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent-800)] transition-colors">Verifikasi Pendaftar Baru</h3>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-1">
                        Terdapat berkas pendaftaran baru yang perlu divalidasi pembayarannya.
                      </p>
                    </div>

                    <div className="text-[var(--color-accent-600)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-[var(--color-accent-200)] shadow-sm">
                      Periksa <ArrowRight size={14} weight="bold" />
                    </div>
                  </Link>
                )}

                {menungguRevisi > 0 && (
                  <Link href="/admin/pendaftar" className="group flex items-center gap-5 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-danger-300)] hover:bg-[var(--color-danger-50)] transition-all duration-200">
                    <div className="w-12 h-12 flex-shrink-0 bg-[var(--color-danger-100)] text-[var(--color-danger-600)] rounded-xl flex items-center justify-center relative">
                      <FileText size={24} weight="duotone" />
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[var(--color-danger-600)] text-white text-xs font-black rounded-lg flex items-center justify-center ring-2 ring-white shadow-sm">
                        {menungguRevisi}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-danger-800)] transition-colors">Tinjau Revisi Dokumen</h3>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)] mt-1">
                        Beberapa dokumen yang ditolak telah diperbarui dan menunggu perbaikan.
                      </p>
                    </div>

                    <div className="text-[var(--color-danger-600)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-[var(--color-danger-200)] shadow-sm">
                      Tinjau <ArrowRight size={14} weight="bold" />
                    </div>
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Statistics (Takes 4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4 md:gap-6">
          
          {/* Class Distribution */}
          <div className="card card-elevated flex-1 !p-6">
            <CardTitle className="mb-5">Pilihan Kelas</CardTitle>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-[var(--color-text)]"><Backpack size={16} className="text-[var(--color-info-500)]" weight="duotone"/> Reguler</span>
                  <span className="text-[var(--color-text-secondary)]">{regulerCount}</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-info-500)] rounded-full" style={{ width: totalMasuk > 0 ? `${(regulerCount / totalMasuk) * 100}%` : '0%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-[var(--color-text)]"><BookOpen size={16} className="text-[var(--color-primary-500)]" weight="duotone"/> Tahfidz</span>
                  <span className="text-[var(--color-text-secondary)]">{tahfidzCount}</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary-500)] rounded-full" style={{ width: totalMasuk > 0 ? `${(tahfidzCount / totalMasuk) * 100}%` : '0%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-[var(--color-text)]"><Globe size={16} className="text-[var(--color-accent-500)]" weight="duotone"/> Bahasa</span>
                  <span className="text-[var(--color-text-secondary)]">{bahasaCount}</span>
                </div>
                <div className="w-full h-2.5 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-500)] rounded-full" style={{ width: totalMasuk > 0 ? `${(bahasaCount / totalMasuk) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="card card-elevated !p-6">
            <CardTitle className="mb-5">Jenis Kelamin</CardTitle>
            
            <div className="flex gap-4 h-3 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-[var(--color-info-500)] transition-all" 
                style={{ width: totalGender > 0 ? `${(lakiLaki / totalGender) * 100}%` : '0%' }}
              ></div>
              <div 
                className="h-full bg-pink-500 transition-all" 
                style={{ width: totalGender > 0 ? `${(perempuan / totalGender) * 100}%` : '0%' }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                <div className="w-6 h-6 rounded-md bg-[var(--color-info-50)] text-[var(--color-info-600)] flex items-center justify-center">
                  <GenderMale size={14} weight="bold" />
                </div>
                <span>{lakiLaki} L</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                <span>{perempuan} P</span>
                <div className="w-6 h-6 rounded-md bg-pink-50 text-pink-600 flex items-center justify-center">
                  <GenderFemale size={14} weight="bold" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
