import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { step1Schema, step2Schema, step3Schema } from '@/lib/validations/registration'
import * as z from 'zod'

// Server-side schema where step4 contains URLs instead of File objects
const apiRegistrationSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: z.object({
    aktaLahirUrl: z.string().url(),
    kartuKeluargaUrl: z.string().url(),
    pasFotoUrl: z.string().url(),
    buktiPembayaranUrl: z.string().url(),
  })
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate body
    const validatedData = apiRegistrationSchema.parse(body)

    const supabase = await createClient()

    // Generate Nomor Pendaftaran, e.g. SPMB-2026-XXXX
    const year = new Date().getFullYear()
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const nomorPendaftaran = `SPMB-${year}-${randomNum}`

    // Generate ID locally to avoid .select() which fails RLS for anon users
    const pendaftarId = crypto.randomUUID()

    // Insert to pendaftar table
    const insertPayload: any = {
        id: pendaftarId,
        nomor_pendaftaran: nomorPendaftaran,
        jenis_pendaftaran: validatedData.step1.jenisPendaftaran,
        pilihan_kelas: validatedData.step1.pilihanKelas,
        punya_saudara: validatedData.step1.punyaSaudara,
        nama_saudara: validatedData.step1.namaSaudara || null,
        unit_saudara: validatedData.step1.unitSaudara || null,
        kelas_saudara: validatedData.step1.kelasSaudara || null,
        kelas_tujuan: validatedData.step1.kelasTujuan || null,
        sumber_informasi: validatedData.step3.sumberInformasi,
        
        nama_lengkap: validatedData.step2.namaLengkap,
        nama_panggilan: validatedData.step2.namaPanggilan,
        nik: validatedData.step2.nik,
        nisn: validatedData.step2.nisn || null,
        tempat_lahir: validatedData.step2.tempatLahir,
        tanggal_lahir: validatedData.step2.tanggalLahir,
        jenis_kelamin: validatedData.step2.jenisKelamin,
        agama: "Islam",
        kewarganegaraan: validatedData.step2.kewarganegaraan,
        anak_ke: validatedData.step2.anakKe,
        jumlah_saudara: 0,
        alamat: validatedData.step2.alamat,
        asal_sekolah: validatedData.step2.asalSekolah,
        
        memiliki_prestasi: validatedData.step2.memilikiPrestasi,
        nama_prestasi: validatedData.step2.namaPrestasi || null,
        tingkat_prestasi: validatedData.step2.tingkatPrestasi || null,
        tahun_prestasi: validatedData.step2.tahunPrestasi || null,
        
        nama_ayah: validatedData.step3.namaAyah,
        nik_ayah: validatedData.step3.nikAyah,
        tahun_lahir_ayah: validatedData.step3.tahunLahirAyah,
        pendidikan_ayah: validatedData.step3.pendidikanAyah,
        pekerjaan_ayah: validatedData.step3.pekerjaanAyah,
        penghasilan_ayah: validatedData.step3.penghasilanAyah,
        no_hp_ayah: validatedData.step3.noHpAyah,
        
        nama_ibu: validatedData.step3.namaIbu,
        nik_ibu: validatedData.step3.nikIbu,
        tahun_lahir_ibu: validatedData.step3.tahunLahirIbu,
        pendidikan_ibu: validatedData.step3.pendidikanIbu,
        pekerjaan_ibu: validatedData.step3.pekerjaanIbu,
        penghasilan_ibu: validatedData.step3.penghasilanIbu,
        no_hp_ibu: validatedData.step3.noHpIbu,
    };

    const { error: pendaftarError } = await (supabase as any)
      .from('pendaftar')
      .insert(insertPayload)

    if (pendaftarError) {
      console.error('Insert pendaftar error:', pendaftarError)
      return NextResponse.json({ error: 'Gagal menyimpan data pendaftar', details: pendaftarError }, { status: 500 })
    }

    // Insert dokumen links
    const dokumenInserts: any[] = [
      { pendaftar_id: pendaftarId, jenis_dokumen: 'akta_lahir', file_url: validatedData.step4.aktaLahirUrl },
      { pendaftar_id: pendaftarId, jenis_dokumen: 'kk', file_url: validatedData.step4.kartuKeluargaUrl },
      { pendaftar_id: pendaftarId, jenis_dokumen: 'pas_foto', file_url: validatedData.step4.pasFotoUrl },
      { pendaftar_id: pendaftarId, jenis_dokumen: 'bukti_bayar', file_url: validatedData.step4.buktiPembayaranUrl }
    ]

    const { error: dokError } = await (supabase as any).from('dokumen').insert(dokumenInserts)
    
    if (dokError) {
       console.error('Insert dokumen error:', dokError)
       // We log the error but still return success for the registration, as the main data was saved.
       // In a real production app, we might want to run this in a transaction or handle partial failures.
    }

    return NextResponse.json({ success: true, id: pendaftarId, nomor_pendaftaran: nomorPendaftaran }, { status: 200 })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validasi data gagal', details: error.issues || (error as any).errors }, { status: 400 })
    }
    console.error('Registration handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { pendaftarId, jenisDokumen, fileUrl } = body

    if (!pendaftarId || !jenisDokumen || !fileUrl) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const supabase = await createClient() as any

    // 1. Update status dokumen ke 'menunggu_verifikasi' dan kosongkan catatan_penolakan
    const { error: dokError } = await supabase
      .from('dokumen')
      .update({
        file_url: fileUrl,
        status: 'menunggu_verifikasi',
        catatan_penolakan: null,
      })
      .eq('pendaftar_id', pendaftarId)
      .eq('jenis_dokumen', jenisDokumen)

    if (dokError) {
      console.error('Update dokumen error:', dokError)
      return NextResponse.json({ error: 'Gagal mengupdate dokumen', details: dokError }, { status: 500 })
    }

    // 2. Update status pendaftar utama ke 'menunggu_verifikasi' jika sebelumnya 'tidak_diterima'
    const { data: pendaftar, error: checkError } = await supabase
      .from('pendaftar')
      .select('status')
      .eq('id', pendaftarId)
      .single()

    if (!checkError && pendaftar) {
      if (pendaftar.status === 'tidak_diterima' || pendaftar.status === 'dokumen_lengkap') {
        await supabase
          .from('pendaftar')
          .update({ status: 'menunggu_verifikasi' })
          .eq('id', pendaftarId)
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('PATCH pendaftaran error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
