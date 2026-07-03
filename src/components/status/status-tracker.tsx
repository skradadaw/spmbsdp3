"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { STATUS_PENDAFTARAN, SITE_CONFIG } from "@/lib/constants";

type PendaftarDokumen = {
  id: string;
  jenis_dokumen: string;
  file_url: string;
  status: 'menunggu_verifikasi' | 'disetujui' | 'ditolak';
  catatan_penolakan?: string;
};

type Pendaftar = {
  id: string;
  nomorPendaftaran: string;
  namaLengkap: string;
  status: keyof typeof STATUS_PENDAFTARAN;
  catatanAdmin?: string;
  isLocked: boolean;
  dokumenDitolak: boolean;
  dokumen: PendaftarDokumen[];
};

const DOCUMENT_LABELS: Record<string, string> = {
  akta_lahir: "Akta Kelahiran",
  kk: "Kartu Keluarga",
  pas_foto: "Pas Foto Anak",
  bukti_bayar: "Bukti Pembayaran OKB",
};

export function StatusTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Pendaftar | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reuploadFiles, setReuploadFiles] = useState<Record<string, File | null>>({});
  const [isUploadingMap, setIsUploadingMap] = useState<Record<string, boolean>>({});

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || searchQuery;
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch(`/api/pendaftaran/${query.trim().toUpperCase()}`);
      if (!res.ok) {
        setResult(null);
        setError("Data pendaftaran tidak ditemukan. Pastikan nomor pendaftaran benar.");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult(null);
      setError("Terjadi kesalahan saat mencari data. Silakan coba lagi.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReupload = async (jenisDokumen: string) => {
    const file = reuploadFiles[jenisDokumen];
    if (!file || !result) return;

    setIsUploadingMap((prev) => ({ ...prev, [jenisDokumen]: true }));

    try {
      // 1. Upload file to Storage via /api/upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", jenisDokumen);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || "Gagal mengunggah file");
      }

      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.url;

      // 2. Patch Pendaftaran
      const patchRes = await fetch("/api/pendaftaran", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendaftarId: result.id,
          jenisDokumen,
          fileUrl,
        }),
      });

      if (!patchRes.ok) {
        throw new Error("Gagal memperbarui status dokumen di server");
      }

      alert("Dokumen berhasil diunggah ulang! Panitia akan segera memverifikasi kembali.");

      // Clean up local file state
      setReuploadFiles((prev) => {
        const copy = { ...prev };
        delete copy[jenisDokumen];
        return copy;
      });

      // Reload pendaftar status
      await handleSearch(undefined, result.nomorPendaftaran);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal mengunggah ulang dokumen. Silakan coba lagi.");
    } finally {
      setIsUploadingMap((prev) => ({ ...prev, [jenisDokumen]: false }));
    }
  };

  if (!result) {
    return (
      <div className="max-w-[450px] mx-auto py-2 flex flex-col items-center text-center">
        <div className="relative w-20 h-20 mb-6 group">
          {/* Glow effect behind */}
          <div className="absolute inset-0 bg-primary-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          {/* Main shape */}
          <div className="relative w-full h-full bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-full flex items-center justify-center transform group-hover:-translate-y-1 transition-transform duration-500">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-full flex items-center justify-center shadow-inner border border-white/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#primary-grad-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="primary-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primary-500)" />
                    <stop offset="100%" stopColor="var(--color-primary-700)" />
                  </linearGradient>
                </defs>
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <circle cx="11.5" cy="11.5" r="3.5" />
                <path d="M14 14l3.5 3.5" />
              </svg>
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 mb-2">Status Pendaftaran</h3>
        <p className="text-sm font-medium text-gray-500 mb-8 max-w-xs leading-relaxed">
          Pantau hasil seleksi Anda secara <span className="text-primary-600 italic">real-time</span>.
        </p>

        <form onSubmit={(e) => handleSearch(e)} className="w-full mt-2 relative">
          <div className="relative flex items-center w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
              autoFocus
              className={`w-full pl-[44px] pr-[110px] py-3.5 bg-white border ${error ? 'border-danger-300 ring-4 ring-danger-500/10' : 'border-gray-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10'} rounded-full shadow-sm outline-none transition-all text-base text-gray-900 placeholder:text-gray-400`}
              placeholder="Masukkan No. Pendaftaran..."
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center">
              <Button type="submit" isLoading={isSearching} className="h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 shadow-sm border-none transition-all hover:shadow hover:-translate-y-0.5">
                Cari
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-danger-500 text-sm text-left mt-3 flex items-center gap-1.5 px-4 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </p>
          )}
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 flex flex-col sm:flex-row items-center justify-center gap-1">
          Lupa nomor pendaftaran? <a href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline font-medium">Hubungi admin.</a>
        </p>
      </div>
    );
  }

  const currentStatusInfo = STATUS_PENDAFTARAN[result.status];
  const currentStep = currentStatusInfo.step;
  const isRejected = result.status === "tidak_diterima";
  const needsReupload = result.dokumenDitolak;

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => {
          setResult(null);
          setError(null);
        }}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all mb-8 border border-transparent hover:border-primary-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
        Cek nomor lain
      </button>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-6 border-b border-border-light">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-2xl">🧑</div>
          <div>
            <h2 className="text-xl font-bold text-text mb-1">{result.namaLengkap}</h2>
            <div className="text-sm text-text-secondary font-mono">No: {result.nomorPendaftaran}</div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-xs text-text-muted uppercase tracking-wider">Status Saat Ini</span>
          <span className={`badge badge-${currentStatusInfo.color} px-4 py-2 text-sm`}>
            {currentStatusInfo.color === "warning" || currentStatusInfo.color === "info" ? (
              <span className={`badge-dot badge-dot-${currentStatusInfo.color} mr-2`} />
            ) : null}
            {currentStatusInfo.label}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-6 relative pl-4 mb-8 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-[21px] before:w-0.5 before:bg-border before:z-0">
        {/* Step 1: Pendaftaran */}
        <div className="relative z-[1] flex gap-4 group" data-completed>
          <div className="w-[38px] h-[38px] rounded-full bg-success-500 border-2 border-success-500 flex items-center justify-center text-sm font-bold text-white shrink-0">✓</div>
          <div className="flex-1 pt-2">
            <h3 className="text-base font-semibold text-success-700 mb-1">Pendaftaran Terkirim</h3>
            <p className="text-sm text-text-secondary">Formulir dan dokumen awal telah diterima sistem.</p>
          </div>
        </div>

        {/* Step 2: Verifikasi */}
        <div className={`relative z-[1] flex gap-4`}>
          <div className={`w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-all ${currentStep > 1
              ? 'bg-success-500 border-success-500 text-white'
              : currentStep === 1
                ? needsReupload
                  ? 'bg-danger-500 border-danger-500 text-white'
                  : 'bg-primary-500 border-primary-500 text-white'
                : 'bg-white border-border text-text-muted'
            }`}>{currentStep > 1 ? "✓" : "2"}</div>
          <div className="flex-1 pt-2">
            <h3 className={`text-base font-semibold mb-1 ${currentStep > 1 ? 'text-success-700' : currentStep === 1 && needsReupload ? 'text-danger-600' : 'text-text'}`}>
              Verifikasi Dokumen & Pembayaran
            </h3>
            <p className="text-sm text-text-secondary">Panitia sedang memeriksa kelengkapan dokumen dan bukti transfer Anda.</p>

            {/* Document List */}
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-semibold text-text-secondary">Daftar Kelengkapan Dokumen:</h4>
              {result.dokumen.map((doc) => (
                <div key={doc.id} className="p-3 bg-bg rounded-lg border border-border-light">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{DOCUMENT_LABELS[doc.jenis_dokumen] || doc.jenis_dokumen}</span>
                    <span className={`badge badge-${doc.status === 'disetujui' ? 'success' : doc.status === 'ditolak' ? 'danger' : 'warning'} text-xs`}>
                      {doc.status === 'disetujui' ? 'Disetujui' : doc.status === 'ditolak' ? 'Ditolak' : 'Menunggu Verifikasi'}
                    </span>
                  </div>

                  {doc.status === 'ditolak' && (
                    <div className="mt-3 pt-3 border-t border-border-light">
                      <div className="flex items-start gap-2 text-danger-500 bg-danger-50 p-2.5 rounded-[var(--radius-sm)] border border-danger-200 text-sm mb-3">
                        <span className="text-base">⚠️</span>
                        <div>
                          <strong>Alasan Penolakan:</strong>
                          <p className="text-xs mt-0.5">{doc.catatan_penolakan || "Dokumen kurang jelas atau tidak sesuai."}</p>
                        </div>
                      </div>

                      <FileUpload
                        label="Pilih File Baru"
                        name={`reupload-${doc.jenis_dokumen}`}
                        value={reuploadFiles[doc.jenis_dokumen] || null}
                        onChange={(f) => setReuploadFiles((prev) => ({ ...prev, [doc.jenis_dokumen]: f }))}
                      />

                      <Button
                        onClick={() => handleReupload(doc.jenis_dokumen)}
                        disabled={!reuploadFiles[doc.jenis_dokumen]}
                        isLoading={isUploadingMap[doc.jenis_dokumen]}
                        size="sm"
                        className="mt-2.5"
                      >
                        Unggah Ulang
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Tes OKB */}
        <div className="relative z-[1] flex gap-4">
          <div className={`w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-all ${currentStep > 4
              ? 'bg-success-500 border-success-500 text-white'
              : currentStep === 4
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'bg-white border-border text-text-muted'
            }`}>{currentStep > 4 ? "✓" : "3"}</div>
          <div className="flex-1 pt-2">
            <h3 className={`text-base font-semibold mb-1 ${currentStep > 4 ? 'text-success-700' : 'text-text'}`}>Terjadwal Tes OKB</h3>
            {currentStep < 4 ? (
              <p className="text-sm text-text-secondary">
                <span className="text-warning-600 flex items-center gap-1 font-medium">
                  ⏳ Menunggu panitia mengatur jadwal tes
                </span>
              </p>
            ) : (
              <p className="text-sm text-text-secondary">Silakan datang ke sekolah pada jadwal yang ditentukan untuk Observasi Kesiapan Belajar.</p>
            )}
          </div>
        </div>

        {/* Step 4: Hasil */}
        <div className="relative z-[1] flex gap-4">
          <div className={`w-[38px] h-[38px] rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-all ${currentStep === 5
              ? isRejected
                ? 'bg-danger-500 border-danger-500 text-white'
                : 'bg-success-500 border-success-500 text-white'
              : 'bg-white border-border text-text-muted'
            }`}>{currentStep === 5 ? (isRejected ? "✕" : "✓") : "4"}</div>
          <div className="flex-1 pt-2">
            <h3 className={`text-base font-semibold mb-1 ${currentStep === 5 ? (isRejected ? 'text-danger-600' : 'text-success-700') : 'text-text'
              }`}>Pengumuman Hasil</h3>
            {currentStep < 5 ? (
              <p className="text-sm text-text-secondary">
                <span className="text-warning-600 flex items-center gap-1 font-medium">
                  ⏳ Menunggu pengumuman hasil seleksi
                </span>
              </p>
            ) : (
              <>
                <p className="text-sm text-text-secondary">Hasil seleksi akhir SPMB SD Plus 3 Al-Muhajirin.</p>
                {!isRejected && (
                  <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center justify-between">
                    <div>
                      <strong className="text-success-700 block">Selamat! Anda Diterima.</strong>
                      <span className="text-sm text-success-600">Unduh bukti pendaftaran / kelulusan Anda.</span>
                    </div>
                    <a
                      href={`/api/bukti-pdf?nomor=${result.nomorPendaftaran}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm font-semibold"
                    >
                      Unduh PDF
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Download PDF button */}
      <div className="pt-6 border-t border-border-light flex justify-end">
        <a
          href={`/api/bukti-pdf?nomor=${result.nomorPendaftaran}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          📄 Unduh Bukti Pendaftaran PDF
        </a>
      </div>
    </div>
  );
}
