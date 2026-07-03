"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLogAktivitas() {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("log_aktivitas")
    .select(`
      id,
      admin_id,
      aksi,
      target_tabel,
      target_id,
      detail,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching logs:", error);
    return { error: "Gagal mengambil data log aktivitas" };
  }

  let logs = data;

  // Enrich logs with pendaftar names if target_tabel is 'pendaftar'
  if (logs && logs.length > 0) {
    const pendaftarIds = logs
      .filter((log: any) => log.target_tabel === 'pendaftar' && log.target_id)
      .map((log: any) => log.target_id);

    if (pendaftarIds.length > 0) {
      const { data: pendaftarData } = await (supabase as any)
        .from('pendaftar')
        .select('id, nama_lengkap, nomor_pendaftaran')
        .in('id', pendaftarIds);

      if (pendaftarData) {
        const pendaftarMap = Object.fromEntries(pendaftarData.map((p: any) => [p.id, p]));
        logs = logs.map((log: any) => {
          if (log.target_tabel === 'pendaftar' && log.target_id && pendaftarMap[log.target_id]) {
            return {
              ...log,
              target_name: pendaftarMap[log.target_id].nama_lengkap,
              target_no: pendaftarMap[log.target_id].nomor_pendaftaran
            };
          }
          return log;
        });
      }
    }
  }

  return { data: logs };
}

export async function insertLogAktivitas(aksi: string, target_tabel: string, target_id: string | null, detail: any) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as any)
    .from("log_aktivitas")
    .insert({
      admin_id: user.id,
      aksi,
      target_tabel,
      target_id,
      detail
    });
}
