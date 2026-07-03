"use client";

import { Button } from "@/components/ui/button";

interface ExcelExportProps {
  data: any[];
}

export function ExcelExport({ data }: ExcelExportProps) {
  const handleExport = async () => {
    if (data.length === 0) {
      alert("Tidak ada data pendaftar untuk diekspor.");
      return;
    }

    const exportData = data.map((item: any, index: number) => {
      // Helper to find a document URL by type
      const getDocUrl = (jenis: string) => {
        const doc = item.dokumen?.find((d: any) => d.jenis_dokumen === jenis);
        return doc?.file_url || "";
      };

      const row: any = {
        // ── Umum ──
        "No": index + 1,
        "Nomor Pendaftaran": item.nomor_pendaftaran,
        "Status": item.status,
        "Jenis Pendaftaran": item.jenis_pendaftaran,
        "Pilihan Kelas": item.pilihan_kelas,
        "Kelas Tujuan (Pindahan)": item.kelas_tujuan || "-",

        // ── Saudara Kandung ──
        "Punya Saudara di Al-Muhajirin": item.punya_saudara,
        "Nama Saudara": item.nama_saudara || "-",
        "Unit Saudara": item.unit_saudara || "-",
        "Kelas Saudara": item.kelas_saudara || "-",

        // ── Identitas Siswa ──
        "Nama Lengkap": item.nama_lengkap,
        "Nama Panggilan": item.nama_panggilan,
        "NIK": item.nik,
        "NISN": item.nisn || "-",
        "Tempat Lahir": item.tempat_lahir,
        "Tanggal Lahir": item.tanggal_lahir,
        "Jenis Kelamin": item.jenis_kelamin === "L" ? "Laki-Laki" : "Perempuan",
        "Agama": item.agama,
        "Kewarganegaraan": item.kewarganegaraan,
        "Anak Ke": item.anak_ke,
        "Jumlah Saudara": item.jumlah_saudara,
        "Alamat": item.alamat,
        "Asal Sekolah": item.asal_sekolah,

        // ── Prestasi ──
        "Memiliki Prestasi": item.memiliki_prestasi,
        "Nama Prestasi": item.nama_prestasi || "-",
        "Tingkat Prestasi": item.tingkat_prestasi || "-",
        "Tahun Prestasi": item.tahun_prestasi || "-",

        // ── Data Ayah ──
        "Nama Ayah": item.nama_ayah,
        "NIK Ayah": item.nik_ayah,
        "Tahun Lahir Ayah": item.tahun_lahir_ayah,
        "Pendidikan Ayah": item.pendidikan_ayah,
        "Pekerjaan Ayah": item.pekerjaan_ayah,
        "Penghasilan Ayah": item.penghasilan_ayah,
        "No. HP Ayah": item.no_hp_ayah,

        // ── Data Ibu ──
        "Nama Ibu": item.nama_ibu,
        "NIK Ibu": item.nik_ibu,
        "Tahun Lahir Ibu": item.tahun_lahir_ibu,
        "Pendidikan Ibu": item.pendidikan_ibu,
        "Pekerjaan Ibu": item.pekerjaan_ibu,
        "Penghasilan Ibu": item.penghasilan_ibu,
        "No. HP Ibu": item.no_hp_ibu,

        // ── Lain-lain ──
        "Sumber Informasi": item.sumber_informasi,
        "Nilai OKB": item.nilai_okb || "-",
        "Catatan Admin": item.catatan_admin || "-",

        // ── Berkas / Dokumen ──
        "URL Akta Lahir": getDocUrl("akta_lahir"),
        "URL Kartu Keluarga": getDocUrl("kk"),
        "URL Pas Foto": getDocUrl("pas_foto"),
        "URL Bukti Pembayaran": getDocUrl("bukti_bayar"),

        // ── Tanggal ──
        "Tanggal Daftar": new Date(item.created_at).toLocaleDateString("id-ID"),
        "Terakhir Diperbarui": new Date(item.updated_at).toLocaleDateString("id-ID"),
      };

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
  };

  return (
    <Button variant="secondary" onClick={handleExport}>
      Unduh Excel
    </Button>
  );
}
