"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExcelExportProps {
  data: any[];
}

export function ExcelExport({ data }: ExcelExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Selection states
  const [includeSiswa, setIncludeSiswa] = useState(true);
  const [includeOrangTua, setIncludeOrangTua] = useState(true);
  const [includeStatus, setIncludeStatus] = useState(true);

  const handleExport = async () => {
    if (data.length === 0) {
      alert("Tidak ada data pendaftar untuk diekspor.");
      return;
    }

    const exportData = data.map((item, index) => {
      let row: any = { No: index + 1, "Nomor Pendaftaran": item.nomor_pendaftaran };

      if (includeSiswa) {
        row["Nama Lengkap"] = item.nama_lengkap;
        row["Nama Panggilan"] = item.nama_panggilan;
        row["NIK"] = item.nik;
        row["NISN"] = item.nisn;
        row["Tempat, Tanggal Lahir"] = `${item.tempat_lahir}, ${item.tanggal_lahir}`;
        row["Jenis Kelamin"] = item.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan';
        row["Agama"] = item.agama;
        row["Asal Sekolah"] = item.asal_sekolah;
        row["Pilihan Kelas"] = item.pilihan_kelas;
      }

      if (includeOrangTua) {
        row["Nama Ayah"] = item.nama_ayah;
        row["No. HP Ayah"] = item.no_hp_ayah;
        row["Nama Ibu"] = item.nama_ibu;
        row["No. HP Ibu"] = item.no_hp_ibu;
        row["Alamat Lengkap"] = item.alamat_lengkap || item.alamat;
      }

      if (includeStatus) {
        row["Status"] = item.status;
        row["Tanggal Daftar"] = new Date(item.created_at).toLocaleDateString("id-ID");
      }

      return row;
    });

    // Dynamically import xlsx only when needed
    const XLSX = await import("xlsx");

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pendaftar");

    // Auto adjust column widths
    const maxWidths = exportData.reduce((acc: any, row: any) => {
      Object.keys(row).forEach((key) => {
        const valLength = row[key]?.toString().length || 0;
        const keyLength = key.length;
        const max = Math.max(valLength, keyLength);
        acc[key] = Math.max(acc[key] || 0, max);
      });
      return acc;
    }, {});

    worksheet["!cols"] = Object.keys(exportData[0]).map(key => ({ wch: maxWidths[key] + 2 }));

    // Generate Excel file
    XLSX.writeFile(workbook, `Data_Pendaftar_SPMB_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Unduh Excel
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-bg)] rounded-[var(--radius-xl)] shadow-lg max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Export Data ke Excel</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Pilih informasi apa saja yang ingin Anda sertakan di dalam file laporan.</p>
            
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeSiswa} 
                  onChange={(e) => setIncludeSiswa(e.target.checked)}
                  className="w-4 h-4 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-[var(--color-text)]">Data Identitas Siswa & Pilihan Kelas</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeOrangTua} 
                  onChange={(e) => setIncludeOrangTua(e.target.checked)}
                  className="w-4 h-4 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-[var(--color-text)]">Data Orang Tua & Alamat</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeStatus} 
                  onChange={(e) => setIncludeStatus(e.target.checked)}
                  className="w-4 h-4 text-[var(--color-primary)] rounded border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-[var(--color-text)]">Status Seleksi & Tanggal Daftar</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleExport}>
                Mulai Unduh
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
