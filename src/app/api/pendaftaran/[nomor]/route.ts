import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizeNomorPendaftaran(nomor: string): string {
  const clean = nomor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (clean.startsWith('SPMB')) {
    const suffix = clean.substring(4);
    if (suffix.length === 6) {
      const yearPart = '20' + suffix.substring(0, 2);
      const numPart = suffix.substring(2);
      return `SPMB-${yearPart}-${numPart}`;
    } else if (suffix.length === 8) {
      const yearPart = suffix.substring(0, 4);
      const numPart = suffix.substring(4);
      return `SPMB-${yearPart}-${numPart}`;
    }
  }
  return nomor;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nomor: string }> }
) {
  try {
    const { nomor } = await params;
    const nomorPendaftaran = normalizeNomorPendaftaran(nomor);

    if (!nomor) {
      return NextResponse.json({ error: 'Nomor pendaftaran wajib diisi' }, { status: 400 })
    }

    const supabase = await createClient()

    // Query data pendaftar along with documents
    const { data, error } = await supabase
      .from('pendaftar')
      .select(`
        id, 
        nomor_pendaftaran, 
        nama_lengkap, 
        status, 
        catatan_admin, 
        is_locked,
        dokumen (
          id,
          jenis_dokumen,
          file_url,
          status,
          catatan_penolakan
        )
      `)
      .eq('nomor_pendaftaran', nomorPendaftaran)
      .single()
 
    if (error || !data) {
      return NextResponse.json({ error: 'Data pendaftaran tidak ditemukan' }, { status: 404 })
    }
 
    const pendaftarData = data as any;
    
    // Determine if any document is rejected
    const dokumenList = pendaftarData.dokumen || [];
    const hasRejectedDokumen = dokumenList.some((doc: any) => doc.status === 'ditolak');

    return NextResponse.json({
      id: pendaftarData.id,
      nomorPendaftaran: pendaftarData.nomor_pendaftaran,
      namaLengkap: pendaftarData.nama_lengkap,
      status: pendaftarData.status,
      catatanAdmin: pendaftarData.catatan_admin,
      isLocked: pendaftarData.is_locked,
      dokumenDitolak: hasRejectedDokumen,
      dokumen: dokumenList,
    })
  } catch (error) {
    console.error('Cek status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
