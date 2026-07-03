import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Mengambil data pendaftar dengan status 'diterima'
    // Hanya memilih kolom yang aman untuk publik: id, nomor_pendaftaran, nama_lengkap, pilihan_kelas
    const { data, error } = await (supabase as any)
      .from('pendaftar')
      .select('id, nomor_pendaftaran, nama_lengkap, pilihan_kelas')
      .eq('status', 'diterima')
      .order('nama_lengkap', { ascending: true });

    if (error) {
      console.error('Error fetching pengumuman:', error);
      return NextResponse.json({ error: 'Gagal mengambil data pengumuman' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error('Pengumuman handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
