"use client";

import { Button } from "@/components/ui/button";

interface WhatsappButtonProps {
  phoneNumber: string;
  parentName: string;
  studentName: string;
  status: string;
}

export function WhatsappButton({ phoneNumber, parentName, studentName, status }: WhatsappButtonProps) {

  const generateMessage = () => {
    switch (status) {
      case "menunggu_verifikasi":
        return `Halo Bapak/Ibu ${parentName},\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin. Kami ingin menginformasikan bahwa data pendaftaran ananda ${studentName} saat ini sedang dalam proses verifikasi. Mohon kesediaannya untuk menunggu informasi selanjutnya.\n\nTerima kasih.`;
      case "dokumen_lengkap":
        return `Halo Bapak/Ibu ${parentName},\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin. Alhamdulillah, dokumen pendaftaran ananda ${studentName} telah kami terima dan dinyatakan LENGKAP.\n\nLangkah selanjutnya adalah melakukan pembayaran biaya tes OKB sesuai instruksi di website, dan mengunggah bukti pembayarannya pada halaman Cek Status.\n\nTerima kasih.`;
      case "pembayaran_terkonfirmasi":
        return `Halo Bapak/Ibu ${parentName},\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin. Pembayaran ananda ${studentName} telah berhasil kami konfirmasi.\n\nMohon menunggu jadwal tes Observasi Kesiapan Belajar (OKB) yang akan kami informasikan lebih lanjut.\n\nTerima kasih.`;
      case "terjadwal_okb":
        return `Halo Bapak/Ibu ${parentName},\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin. Jadwal tes Observasi Kesiapan Belajar (OKB) untuk ananda ${studentName} telah ditentukan. Mohon cek halaman Cek Status pada website pendaftaran untuk detail waktu pelaksanaannya.\n\nTerima kasih.`;
      case "diterima":
        return `Selamat Bapak/Ibu ${parentName}!\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin dengan bangga menyampaikan bahwa ananda ${studentName} dinyatakan LULUS dan DITERIMA sebagai siswa baru.\n\nSilakan cek website untuk mengunduh Surat Kelulusan dan informasi Daftar Ulang.\n\nTerima kasih.`;
      case "tidak_diterima":
        return `Halo Bapak/Ibu ${parentName},\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin memohon maaf menyampaikan bahwa ananda ${studentName} saat ini BELUM BISA DITERIMA sebagai siswa baru di sekolah kami.\n\nKeputusan ini didasarkan pada hasil seleksi dan tes OKB. Kami mendoakan yang terbaik untuk pendidikan ananda selanjutnya.\n\nTerima kasih.`;
      default:
        return `Halo Bapak/Ibu ${parentName},\n\nKami dari Panitia SPMB SD Plus 3 Al-Muhajirin, ingin menyampaikan informasi terkait pendaftaran ananda ${studentName}...`;
    }
  };

  const handleWhatsAppClick = () => {
    // 1. Hapus semua karakter selain angka (spasi, strip, tanda +)
    let cleanNumber = phoneNumber.replace(/\D/g, "");
    
    // 2. Sesuaikan kode negara
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.substring(1);
    } else if (cleanNumber.startsWith("8")) {
      // Jika user langsung mengetik "812..." tanpa 0 atau 62
      cleanNumber = "62" + cleanNumber;
    }

    if (!cleanNumber || cleanNumber.length < 10) {
      alert("Nomor WhatsApp tidak valid atau terlalu pendek.");
      return;
    }

    const message = encodeURIComponent(generateMessage());
    // Menggunakan API standar WhatsApp (api.whatsapp.com) untuk routing yang lebih andal (App/Web)
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${message}`;
    window.open(waUrl, "_blank");
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handleWhatsAppClick}
      className="bg-[#25D366] text-white hover:bg-[#128C7E] hover:text-white border-transparent"
    >
      💬 Hubungi via WhatsApp
    </Button>
  );
}
