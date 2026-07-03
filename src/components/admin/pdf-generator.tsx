"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getPengaturan } from "@/app/admin/pengaturan/actions";

interface PdfGeneratorProps {
  data: any;
  type: "kartu" | "kelulusan";
}

export function PdfGenerator({ data, type }: PdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = async () => {
    try {
      setIsGenerating(true);
      
      // 1. Ambil pengaturan untuk mendapatkan URL template & koordinat
      const { data: settings, error: settingsError } = await getPengaturan();
      
      if (settingsError || !settings) {
        alert("Gagal mengambil pengaturan template PDF.");
        return;
      }

      // 2. Tentukan template mana yang dipakai
      const templateData = type === "kartu" 
        ? settings.template_bukti_pendaftaran 
        : settings.template_surat_kelulusan_okb;

      // Jika belum diatur atau URL kosong, kita pakai HTML print biasa (fallback)
      if (!templateData || typeof templateData === 'string' || !templateData.url) {
        fallbackHtmlPrint();
        return;
      }

      // 3. Fetch PDF Asli dari Storage
      const response = await fetch(templateData.url);
      if (!response.ok) {
        alert("Gagal mengunduh file template PDF dari server.");
        return;
      }
      const pdfBytes = await response.arrayBuffer();

      // 4. Load PDF ke pdf-lib (dynamically imported)
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      // Kita asumsikan gambar/teks ditaruh di halaman pertama
      const firstPage = pages[0];
      const { height } = firstPage.getSize(); // pdf-lib Y-axis mulai dari bawah (0) ke atas (height)
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Helper untuk convert Y coordinate. 
      // Biasanya user ngisi Y dari atas ke bawah (Top-Left origin), tapi pdf-lib pakai Bottom-Left origin.
      // Jadi: actualY = height - inputY
      const drawField = (field: any, text: string) => {
        if (!field) return;
        firstPage.drawText(text, {
          x: field.x || 100,
          y: height - (field.y || 100), 
          size: field.size || 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      };

      // 5. Gambar Teks Dinamis
      drawField(templateData.fields?.nama, data.nama_lengkap || "-");
      drawField(templateData.fields?.nomor_pendaftaran, data.nomor_pendaftaran || "-");
      
      // Anda bisa tambahkan variabel dinamis lain sesuai kebutuhan di sini...

      // 6. Save dan Download PDF
      const pdfBytesModified = await pdfDoc.save();
      const blob = new Blob([pdfBytesModified as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type === 'kartu' ? 'Bukti_Pendaftaran' : 'Surat_Kelulusan'}_${data.nama_lengkap}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat memproses PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackHtmlPrint = () => {
    // FALLBACK: Jika template belum di-set, gunakan mode print standar HTML lama
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Mohon izinkan pop-up untuk mencetak dokumen.");
      return;
    }

    const title = type === "kartu" ? "Kartu Pendaftaran SPMB" : "Surat Kelulusan SPMB";
    const date = new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    let contentHtml = "";

    if (type === "kartu") {
      contentHtml = `
        <div class="print-container">
          <div class="header">
            <h2>${title}</h2>
            <h3>SD Plus 3 Al-Muhajirin</h3>
            <p>Tahun Ajaran 2026/2027</p>
          </div>
          <div class="info-box">
            <p><strong>Nomor Pendaftaran:</strong> ${data.nomor_pendaftaran}</p>
            <p><strong>Nama Lengkap:</strong> ${data.nama_lengkap}</p>
            <p><strong>Pilihan Kelas:</strong> ${data.pilihan_kelas}</p>
            <p><strong>Jenis Kelamin:</strong> ${data.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</p>
            <p><strong>Tempat, Tanggal Lahir:</strong> ${data.tempat_lahir}, ${data.tanggal_lahir}</p>
          </div>
          <div class="info-box mt">
            <p><strong>Nama Orang Tua / Wali:</strong> ${data.nama_ayah || data.nama_ibu}</p>
            <p><strong>Nomor Kontak:</strong> ${data.no_wa_ayah || data.no_wa_ibu || data.no_hp_ayah}</p>
            <p><strong>Alamat Lengkap:</strong> ${data.alamat || data.alamat_lengkap}</p>
          </div>
          <p class="footer-note">Kartu ini harap disimpan dan dicetak sebagai bukti pendaftaran yang sah. Bawalah kartu ini pada saat pelaksanaan Tes Observasi Kesiapan Belajar (OKB).</p>
          <div class="signature">
            <p>Purwakarta, ${date}</p>
            <br/><br/><br/>
            <p><strong>Panitia SPMB</strong></p>
          </div>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="print-container">
          <div class="header">
            <h2>${title}</h2>
            <h3>SD Plus 3 Al-Muhajirin</h3>
            <p>Tahun Ajaran 2026/2027</p>
          </div>
          <p>Kepada Yth. Bapak/Ibu Wali dari:</p>
          <div class="info-box">
            <p><strong>Nama Lengkap:</strong> ${data.nama_lengkap}</p>
            <p><strong>Nomor Pendaftaran:</strong> ${data.nomor_pendaftaran}</p>
            <p><strong>Pilihan Kelas:</strong> ${data.pilihan_kelas}</p>
          </div>
          <p>Dengan hormat,</p>
          <p>Berdasarkan hasil seleksi dan Observasi Kesiapan Belajar (OKB) yang telah dilaksanakan, dengan ini kami memutuskan bahwa ananda tersebut di atas dinyatakan:</p>
          <h2 class="status-lulus">LULUS / DITERIMA</h2>
          <p>Sebagai Siswa Baru SD Plus 3 Al-Muhajirin Tahun Ajaran 2026/2027.</p>
          <p>Selanjutnya, mohon Bapak/Ibu untuk segera melakukan proses <strong>Daftar Ulang</strong> sesuai dengan ketentuan yang berlaku. Kelalaian dalam melakukan daftar ulang sesuai jadwal dapat mengakibatkan status kelulusan dibatalkan.</p>
          <div class="signature mt">
            <p>Purwakarta, ${date}</p>
            <p>Kepala SD Plus 3 Al-Muhajirin</p>
            <br/><br/><br/><br/>
            <p><strong>_____________________</strong></p>
          </div>
        </div>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - ${data.nama_lengkap}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 40px; }
          .print-container { max-width: 800px; margin: 0 auto; border: 2px solid #ccc; padding: 40px; border-radius: 8px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .header h2 { margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; }
          .header h3 { margin: 0 0 5px 0; font-size: 20px; }
          .header p { margin: 0; font-size: 14px; color: #666; }
          .info-box { background-color: #f9f9f9; border: 1px solid #ddd; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
          .info-box p { margin: 8px 0; font-size: 14px; }
          .mt { margin-top: 30px; }
          .footer-note { font-size: 13px; color: #555; font-style: italic; margin-top: 30px; }
          .signature { margin-top: 50px; text-align: right; }
          .status-lulus { text-align: center; font-size: 28px; color: #166534; letter-spacing: 2px; margin: 30px 0; padding: 10px; border: 2px dashed #166534; }
          @media print { body { padding: 0; } .print-container { border: none; padding: 20px; } }
        </style>
      </head>
      <body onload="window.print(); window.onafterprint = function(){ window.close(); }">
        ${contentHtml}
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Button 
      variant={type === "kartu" ? "secondary" : "primary"}
      onClick={handlePrint}
      isLoading={isGenerating}
    >
      🖨️ Cetak {type === "kartu" ? "Kartu" : "Surat Lulus"}
    </Button>
  );
}
