"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { insertLogAktivitas } from "../log/actions";

// Mengambil daftar semua pendaftar
export async function getPendaftarList() {
  const supabase = await createClient();
  
  // Gunakan raw cast untuk supabase agar bisa query ke tabel pendaftar (yang bypass RLS jika service_role, tapi di admin kita asumsikan user auth punya akses atau RLS diatur)
  // Untuk fase ini, kita akan query normal. Jika terblokir RLS, pastikan RLS membolehkan akses baca untuk admin.
  // Tapi untuk amannya dan karena admin sudah login, kita query saja:
  const { data, error } = await (supabase as any)
    .from("pendaftar")
    .select("*, dokumen(*)")
    .order("created_at", { ascending: false })
    .limit(1000); // Prevent unbounded fetching

  if (error) {
    console.error("Error fetching pendaftar list:", error);
    return { error: "Gagal mengambil data pendaftar" };
  }

  return { data };
}

// Mengambil detail 1 pendaftar berdasarkan ID
export async function getPendaftarDetail(id: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("pendaftar")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching pendaftar detail:", error);
    return { error: "Gagal mengambil detail pendaftar" };
  }

  // Ambil data dokumen (jika statusnya bukan draft/menunggu_pembayaran)
  const { data: dokumen, error: docError } = await (supabase as any)
    .from("dokumen")
    .select("*")
    .eq("pendaftar_id", id);

  return { data, dokumen: dokumen || [] };
}

// Mengupdate status pendaftar (termasuk catatan penolakan)
export async function updateStatusPendaftar(id: string, status: string, catatan?: string) {
  const supabase = await createClient();

  const updateData: any = { status };
  
  // Jika statusnya ditolak_berkas, maka kita set catatannya.
  // Jika statusnya maju ke tahap lain, kita bisa bersihkan catatannya.
  if (status === 'ditolak_berkas') {
    updateData.catatan_admin = catatan;
  } else {
    updateData.catatan_admin = null;
  }

  const { error } = await (supabase as any)
    .from("pendaftar")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating status:", error);
    return { error: "Gagal memperbarui status pendaftar" };
  }

  revalidatePath("/admin/pendaftar");
  revalidatePath(`/admin/pendaftar/${id}`);
  revalidatePath("/admin/dashboard");

  // Catat ke log aktivitas
  await insertLogAktivitas("UPDATE_STATUS_PENDAFTAR", "pendaftar", id, {
    status_baru: status,
    catatan_admin: catatan || null
  });
  
  return { success: true };
}

// Mengupdate data pendaftar (field-level edit oleh admin)
export async function updatePendaftarData(id: string, fields: Record<string, string>) {
  const supabase = await createClient();

  // Whitelist kolom yang boleh diupdate
  const allowedFields = [
    "nama_lengkap", "nama_panggilan", "nik", "nisn", "tempat_lahir", "tanggal_lahir",
    "jenis_kelamin", "kewarganegaraan", "anak_ke",
    "alamat", "asal_sekolah", "jenis_pendaftaran", "kelas_tujuan", "pilihan_kelas", "sumber_informasi",
    "nama_ayah", "nik_ayah", "tahun_lahir_ayah", "pendidikan_ayah", "pekerjaan_ayah", "penghasilan_ayah", "no_hp_ayah",
    "nama_ibu", "nik_ibu", "tahun_lahir_ibu", "pendidikan_ibu", "pekerjaan_ibu", "penghasilan_ibu", "no_hp_ibu",
  ];

  const sanitized: Record<string, string> = {};
  for (const [key, val] of Object.entries(fields)) {
    if (allowedFields.includes(key)) {
      sanitized[key] = val;
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return { error: "Tidak ada field yang valid untuk diupdate." };
  }

  const { error } = await (supabase as any)
    .from("pendaftar")
    .update(sanitized)
    .eq("id", id);

  if (error) {
    console.error("Error updating pendaftar data:", error);
    return { error: "Gagal memperbarui data pendaftar." };
  }

  revalidatePath("/admin/pendaftar");
  revalidatePath(`/admin/pendaftar/${id}`);
  revalidatePath("/admin/dashboard");

  await insertLogAktivitas("EDIT_DATA_PENDAFTAR", "pendaftar", id, {
    fields_updated: Object.keys(sanitized),
  });

  return { success: true };
}
