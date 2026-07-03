"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { insertLogAktivitas } from "../log/actions";

export async function getPengaturan() {
  const supabase = await createClient();

  // We are going to fetch all settings
  const { data, error } = await (supabase as any)
    .from("pengaturan")
    .select("*");

  if (error) {
    console.error("Error fetching pengaturan:", error);
    return { error: "Gagal mengambil pengaturan" };
  }

  // Convert array to a key-value object
  const settingsObj: Record<string, any> = {};
  if (data) {
    data.forEach((item: any) => {
      settingsObj[item.kunci] = item.nilai;
    });
  }

  // Define defaults if they don't exist
  const defaults = {
    status_pendaftaran: true,
    tahun_ajaran: "2026/2027",
    kontak_bantuan: "081234567890",
    biaya_pendaftaran: 350000,
    rekening_bank: "Bank Syariah Indonesia (BSI)",
    rekening_nomor: "XXX-XXXX-XXX",
    rekening_nama: "SD Plus 3 Al-Muhajirin",
    info_rekening: "<p>Silakan transfer ke rekening berikut:<br>Bank BCA: 1234567890 a.n. SPMB</p>",
    teks_pengumuman_dashboard: "Selamat datang di portal SPMB. Pastikan Anda melengkapi data diri dan mengunggah dokumen yang diperlukan.",
    template_wa_tagihan: "Halo {{nama}},\n\nTerima kasih telah mendaftar. Silakan lakukan pembayaran sebesar Rp {{biaya}} sebelum batas waktu yang ditentukan.\n\nTerima kasih.",
    gelombang_pendaftaran: [{ id: "1", nama: "Gelombang 1", mulai: "2026-01-01", selesai: "2026-03-31" }],
    template_surat_kelulusan_okb: {
      url: "",
      fields: {
        nama: { x: 200, y: 500, size: 14 },
        nomor_pendaftaran: { x: 200, y: 480, size: 12 },
      }
    },
    template_bukti_pendaftaran: {
      url: "",
      fields: {
        nama: { x: 200, y: 500, size: 14 },
        nomor_pendaftaran: { x: 200, y: 480, size: 12 },
      }
    }
  };

  return { data: { ...defaults, ...settingsObj } };
}

export async function updatePengaturan(kunci: string, nilai: any, deskripsi: string = "") {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("pengaturan")
    .upsert(
      { kunci, nilai, deskripsi },
      { onConflict: 'kunci' } // Ensure `kunci` is UNIQUE in DB
    );

  if (error) {
    console.error("Error updating pengaturan:", error);
    return { error: `Gagal memperbarui ${kunci}` };
  }

  revalidatePath("/"); // Revalidate whole site as settings affect public pages
  revalidatePath("/admin/pengaturan");
  
  // Catat ke log aktivitas
  await insertLogAktivitas("UPDATE_PENGATURAN", "pengaturan", kunci, {
    nilai_baru: nilai,
    deskripsi
  });

  return { success: true };
}
