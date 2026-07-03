import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nomor = searchParams.get('nomor');

    if (!nomor) {
      return NextResponse.json({ error: 'Nomor pendaftaran wajib diisi' }, { status: 400 });
    }

    const supabase = await createClient();

    // Query pendaftar using server-side client (service role) to bypass RLS
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*')
      .eq('nomor_pendaftaran', nomor)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Pendaftar tidak ditemukan' }, { status: 404 });
    }

    const pendaftar = data as any;

    // Generate QR Code containing verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ppdb.sdplus3almuhajirin.com';
    const qrValue = `${baseUrl}/cek-status?nomor=${pendaftar.nomor_pendaftaran}`;
    const qrDataUrl = await QRCode.toDataURL(qrValue, { width: 120, margin: 1 });

    // Create PDF
    // A4 dimensions in pt: 595.28 x 841.89
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    // 1. Header (Kop Surat Sekolah)
    // Draw double lines for Kop Surat
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(40, 95, 555, 95);
    doc.setLineWidth(2);
    doc.line(40, 99, 555, 99);

    // School Name & Details
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('YAYASAN AL-MUHAJIRIN PURWAKARTA', 297, 45, { align: 'center' });
    doc.setFontSize(16);
    doc.text('SD PLUS 3 AL-MUHAJIRIN', 297, 68, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Jl. Veteran No. 193, Nagri Kaler, Kec. Purwakarta, Kab. Purwakarta, Jawa Barat 41114', 297, 85, { align: 'center' });

    // 2. Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('BUKTI PENDAFTARAN ALUR SPMB ONLINE', 297, 130, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Tahun Pelajaran 2026/2027`, 297, 145, { align: 'center' });

    // 3. Candidate Details Section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('A. INFORMASI PENDAFTARAN', 40, 180);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    const startX = 50;
    const labelX = 180;
    
    // Row 1: Nomor Pendaftaran
    doc.text('Nomor Pendaftaran', startX, 205);
    doc.text(':', labelX, 205);
    doc.setFont('Helvetica', 'bold');
    doc.text(pendaftar.nomor_pendaftaran, labelX + 10, 205);
    doc.setFont('Helvetica', 'normal');

    // Row 2: Nama Lengkap
    doc.text('Nama Lengkap', startX, 225);
    doc.text(':', labelX, 225);
    doc.text(pendaftar.nama_lengkap, labelX + 10, 225);

    // Row 3: Jenis Pendaftaran & Kelas Pilihan
    doc.text('Jenis Pendaftaran', startX, 245);
    doc.text(':', labelX, 245);
    doc.text(pendaftar.jenis_pendaftaran === 'siswa_baru' ? 'Siswa Baru' : 'Pindahan', labelX + 10, 245);

    doc.text('Program Kelas Pilihan', startX, 265);
    doc.text(':', labelX, 265);
    doc.text(pendaftar.pilihan_kelas.toUpperCase(), labelX + 10, 265);

    // Row 4: Sekolah Asal
    doc.text('Sekolah Asal', startX, 285);
    doc.text(':', labelX, 285);
    doc.text(pendaftar.asal_sekolah, labelX + 10, 285);

    // 4. Student Identity
    doc.setFont('Helvetica', 'bold');
    doc.text('B. DATA DIRI SISWA', 40, 320);
    doc.setFont('Helvetica', 'normal');

    doc.text('NIK Siswa', startX, 345);
    doc.text(':', labelX, 345);
    doc.text(pendaftar.nik, labelX + 10, 345);

    doc.text('Tempat, Tanggal Lahir', startX, 365);
    doc.text(':', labelX, 365);
    doc.text(`${pendaftar.tempat_lahir}, ${pendaftar.tanggal_lahir}`, labelX + 10, 365);

    doc.text('Jenis Kelamin', startX, 385);
    doc.text(':', labelX, 385);
    doc.text(pendaftar.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan', labelX + 10, 385);

    doc.text('Alamat Lengkap', startX, 405);
    doc.text(':', labelX, 405);
    const splitAlamat = doc.splitTextToSize(pendaftar.alamat, 330);
    doc.text(splitAlamat, labelX + 10, 405);

    // 5. Parent Identity
    const parentY = 460;
    doc.setFont('Helvetica', 'bold');
    doc.text('C. DATA ORANG TUA / WALI', 40, parentY);
    doc.setFont('Helvetica', 'normal');

    doc.text('Nama Ayah', startX, parentY + 25);
    doc.text(':', labelX, parentY + 25);
    doc.text(pendaftar.nama_ayah, labelX + 10, parentY + 25);

    doc.text('No. HP Ayah', startX, parentY + 45);
    doc.text(':', labelX, parentY + 45);
    doc.text(pendaftar.no_hp_ayah, labelX + 10, parentY + 45);

    doc.text('Nama Ibu', startX, parentY + 65);
    doc.text(':', labelX, parentY + 65);
    doc.text(pendaftar.nama_ibu, labelX + 10, parentY + 65);

    doc.text('No. HP Ibu', startX, parentY + 85);
    doc.text(':', labelX, parentY + 85);
    doc.text(pendaftar.no_hp_ibu, labelX + 10, parentY + 85);

    // 6. Signature and QR Code Section
    const footerY = 600;
    
    // QR Code Image
    doc.addImage(qrDataUrl, 'PNG', 40, footerY + 10, 100, 100);
    doc.setFontSize(8);
    doc.setFont('Helvetica', 'oblique');
    doc.text('Scan QR Code ini untuk', 40, footerY + 120);
    doc.text('mengecek status verifikasi terbaru.', 40, footerY + 130);
    
    // Signature
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Purwakarta, ' + new Date(pendaftar.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 380, footerY + 20);
    doc.text('Panitia SPMB', 380, footerY + 35);
    doc.text('SD Plus 3 Al-Muhajirin', 380, footerY + 47);
    
    doc.setFont('Helvetica', 'bold');
    doc.text('( ______________________ )', 380, footerY + 110);
    
    // Output PDF to Buffer
    const pdfOutput = doc.output('arraybuffer');

    return new Response(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Bukti_Pendaftaran_${pendaftar.nomor_pendaftaran}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Generate PDF error:', error);
    return NextResponse.json({ error: 'Gagal membuat bukti pendaftaran PDF' }, { status: 500 });
  }
}
