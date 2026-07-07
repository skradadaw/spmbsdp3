"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
  const supabase = await createClient();

  // We fetch counts by status, gender, and class choice
  const { data, error } = await (supabase as any)
    .from("pendaftar")
    .select("status, jenis_kelamin, pilihan_kelas");

  if (error) {
    console.error("Error fetching metrics:", error);
    return { error: "Gagal mengambil data metrik" };
  }

  const metrics = {
    total: 0,
    menunggu_verifikasi: 0,
    menunggu_pembayaran: 0, 
    dokumen_lengkap: 0,
    pembayaran_terkonfirmasi: 0,
    terjadwal_okb: 0,
    diterima: 0,
    tidak_diterima: 0,
    diterima_l: 0,
    diterima_p: 0,
    pendaftar_reguler: 0,
    pendaftar_tahfidz: 0,
    pendaftar_bahasa: 0,
  };

  if (data) {
    metrics.total = data.length;
    data.forEach((item: any) => {
      // Count by class for all registered students
      if (item.pilihan_kelas === "reguler") metrics.pendaftar_reguler++;
      else if (item.pilihan_kelas === "tahfidz") metrics.pendaftar_tahfidz++;
      else if (item.pilihan_kelas === "english") metrics.pendaftar_bahasa++;

      // Count by status
      if (item.status === "menunggu_verifikasi") metrics.menunggu_verifikasi++;
      else if (item.status === "menunggu_pembayaran") metrics.menunggu_pembayaran++;
      else if (item.status === "dokumen_lengkap") metrics.dokumen_lengkap++;
      else if (item.status === "pembayaran_terkonfirmasi") metrics.pembayaran_terkonfirmasi++;
      else if (item.status === "terjadwal_okb") metrics.terjadwal_okb++;
      else if (item.status === "diterima") {
        metrics.diterima++;
        if (item.jenis_kelamin === "L") metrics.diterima_l++;
        else if (item.jenis_kelamin === "P") metrics.diterima_p++;
      }
      else if (item.status === "tidak_diterima") metrics.tidak_diterima++;
    });
  }

  // Count rejected documents
  const { data: rejectedDocs, error: rejectedError } = await (supabase as any)
    .from("dokumen")
    .select("id")
    .eq("status", "ditolak");

  const dokumenDitolakCount = rejectedDocs ? rejectedDocs.length : 0;

  return { data: { ...metrics, dokumenDitolakCount } };
}
