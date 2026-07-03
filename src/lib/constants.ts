/* ============================================================
   SPMB Constants — Application-wide constants
   ============================================================ */

export const SITE_CONFIG = {
  schoolName: "SD Plus 3 Al-Muhajirin",
  fullSchoolName: "SD Plus 3 Al-Muhajirin Purwakarta",
  academicYear: "2026/2027",
  subdomain: "ppdb.sdplus3almuhajirin.com",
  address: "Jl. Veteran No. 193, Nagri Kaler, Kec. Purwakarta, Kabupaten Purwakarta, Jawa Barat 41114",
  phone: "0264-XXXXXXX",
  whatsappNumber: "6281XXXXXXXXX",
  whatsappDisplay: "0812-XXXX-XXXX",
  email: "spmb@sdplus3almuhajirin.com",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.123!2d107.442!3d-6.556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPurwakarta!5e0!3m2!1sen!2sid!4v1",
} as const;

export const REGISTRATION_FEE = {
  amount: 350000,
  formatted: "Rp 350.000",
  bankName: "Bank Syariah Indonesia (BSI)",
  accountNumber: "XXX-XXXX-XXX",
  accountHolder: "SD Plus 3 Al-Muhajirin",
} as const;

export const IMPORTANT_DATES = {
  registrationStart: "1 Juni 2026",
  registrationEnd: "10 Juli 2026",
  documentVerification: "1 Juni – 12 Juli 2026",
  paymentDeadline: "12 Juli 2026",
  okbTestDate: "15 Juli 2026",
  okbTestTime: "08.00 WIB",
  announcementDate: "25 Juli 2026",
} as const;

export const JENIS_PENDAFTARAN = [
  { value: "siswa_baru", label: "Siswa Baru" },
  { value: "pindahan", label: "Pindahan" },
] as const;

export const PILIHAN_KELAS = [
  {
    value: "reguler",
    label: "Reguler",
    description: "Memadukan keunggulan kurikulum nasional dengan penanaman karakter Islami yang kuat untuk mencetak generasi cerdas & berakhlak mulia.",
    iconId: "books",
  },
  {
    value: "tahfidz",
    label: "Tahfidz",
    description: "Menumbuhkan kecintaan terhadap Al-Qur'an sejak dini dengan target hafalan 4 Juz, membina generasi Qur'ani berprestasi.",
    iconId: "book-open",
  },
  {
    value: "english",
    label: "English",
    description: "Membekali ananda dengan kecakapan global melalui penguatan intensif bahasa Inggris, siap berprestasi di masa depan.",
    iconId: "globe",
  },
] as const;

export const UNIT_SEKOLAH = [
  { value: "tk", label: "TK Al-Muhajirin" },
  { value: "sd", label: "SD Al-Muhajirin" },
  { value: "smp", label: "SMP Al-Muhajirin" },
  { value: "sma", label: "SMA Al-Muhajirin" },
  { value: "smk", label: "SMK Al-Muhajirin" },
] as const;

export const SUMBER_INFORMASI = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website Sekolah" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp / Grup WA" },
  { value: "brosur", label: "Brosur / Spanduk" },
  { value: "teman", label: "Teman / Keluarga" },
  { value: "alumni", label: "Alumni" },
  { value: "guru", label: "Guru TK / PAUD" },
  { value: "lainnya", label: "Lainnya" },
] as const;

export const PENGHASILAN_OPTIONS = [
  { value: "< 1.5jt", label: "< Rp1,5 juta" },
  { value: "1.5jt - 3jt", label: "Rp1,5 juta - Rp3 juta" },
  { value: "3jt - 5jt", label: "Rp3 juta - Rp5 juta" },
  { value: "5jt - 10jt", label: "Rp5 juta - Rp10 juta" },
  { value: "> 10jt", label: "> Rp10 juta" },
] as const;

export const PENDIDIKAN_OPTIONS = [
  { value: "sd", label: "SD / Sederajat" },
  { value: "smp", label: "SMP / Sederajat" },
  { value: "sma", label: "SMA / SMK / Sederajat" },
  { value: "d1", label: "Diploma 1 (D1)" },
  { value: "d2", label: "Diploma 2 (D2)" },
  { value: "d3", label: "Diploma 3 (D3)" },
  { value: "s1", label: "Sarjana (S1)" },
  { value: "s2", label: "Magister (S2)" },
  { value: "s3", label: "Doktor (S3)" },
] as const;

export const PRESTASI_TINGKAT = [
  { value: "kecamatan", label: "Kecamatan" },
  { value: "kabupaten", label: "Kabupaten / Kota" },
  { value: "provinsi", label: "Provinsi" },
  { value: "nasional", label: "Nasional" },
] as const;

export const STATUS_PENDAFTARAN = {
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    color: "warning",
    step: 1,
  },
  dokumen_lengkap: {
    label: "Dokumen Lengkap",
    color: "info",
    step: 2,
  },
  pembayaran_terkonfirmasi: {
    label: "Pembayaran Terkonfirmasi",
    color: "info",
    step: 3,
  },
  terjadwal_okb: {
    label: "Terjadwal OKB",
    color: "info",
    step: 4,
  },
  diterima: {
    label: "Diterima",
    color: "success",
    step: 5,
  },
  tidak_diterima: {
    label: "Tidak Diterima",
    color: "danger",
    step: 5,
  },
} as const;

export const DOCUMENT_TYPES = [
  {
    key: "aktaLahir",
    label: "Akta Kelahiran",
    description: "Scan atau foto akta kelahiran anak",
    accept: ".pdf,.jpg,.jpeg,.png,.webp",
  },
  {
    key: "kartuKeluarga",
    label: "Kartu Keluarga",
    description: "Scan atau foto kartu keluarga",
    accept: ".pdf,.jpg,.jpeg,.png,.webp",
  },
  {
    key: "pasFoto",
    label: "Pas Foto Anak",
    description: "Boleh menggunakan foto bebas, asalkan sopan dan terlihat rapi.",
    accept: ".jpg,.jpeg,.png,.webp",
  },
  {
    key: "buktiPembayaran",
    label: "Bukti Pembayaran OKB",
    description: "Screenshot atau foto bukti transfer",
    accept: ".pdf,.jpg,.jpeg,.png,.webp",
  },
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MAX_FILE_SIZE_DISPLAY = "5 MB";

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const FAQ_ITEMS = [
  {
    question: "Berapa usia minimal untuk mendaftar di SD Plus 3 Al-Muhajirin?",
    answer:
      "Calon peserta didik minimal berusia 6 tahun pada tanggal 1 Juli 2026. Usia 5 tahun 6 bulan dapat diterima dengan syarat tertentu sesuai kebijakan sekolah.",
  },
  {
    question: "Apa itu Tes OKB (Observasi Kesiapan Belajar)?",
    answer:
      "Tes OKB adalah proses observasi yang dilakukan secara tatap muka di sekolah untuk mengukur kesiapan belajar anak. Tes ini meliputi kemampuan dasar kognitif, motorik, dan sosial-emosional. Tes dilakukan oleh tim guru yang berpengalaman.",
  },
  {
    question: "Apa perbedaan program kelas Reguler, Tahfidz, dan Bahasa?",
    answer:
      "Program Reguler mengikuti kurikulum nasional dengan muatan Islami. Program Tahfidz menambahkan fokus hafalan Al-Qur'an minimal 5 juz. Program Bahasa memperkuat kemampuan bahasa Arab dan Inggris. Semua program mendapat pembelajaran berkualitas yang sama.",
  },
  {
    question: "Bagaimana cara mengecek status pendaftaran?",
    answer:
      "Setelah berhasil mendaftar, Anda akan mendapat nomor pendaftaran unik. Kunjungi halaman \"Cek Status\" dan masukkan nomor pendaftaran untuk melihat progress pendaftaran Anda secara real-time.",
  },
  {
    question: "Apakah dokumen bisa diunggah ulang jika ditolak?",
    answer:
      "Ya, jika dokumen Anda ditolak oleh panitia (misalnya karena kurang jelas), Anda dapat mengunggah ulang dokumen langsung dari halaman Cek Status tanpa perlu mendaftar ulang.",
  },
  {
    question: "Apakah data pendaftaran bisa diedit setelah dikirim?",
    answer:
      "Ya, Anda dapat mengedit data pendaftaran selama status masih \"Menunggu Verifikasi\". Setelah panitia memverifikasi data Anda, data akan terkunci dan tidak bisa diubah.",
  },
  {
    question: "Berapa biaya pendaftaran / OKB?",
    answer:
      `Biaya Tes OKB sebesar ${REGISTRATION_FEE.formatted}. Pembayaran dilakukan melalui transfer bank ke rekening ${REGISTRATION_FEE.bankName} atas nama ${REGISTRATION_FEE.accountHolder}. Bukti transfer diunggah saat pendaftaran.`,
  },
  {
    question: "Kapan pengumuman hasil SPMB?",
    answer:
      `Pengumuman hasil SPMB akan diumumkan pada ${IMPORTANT_DATES.announcementDate}. Hasil dapat dicek melalui halaman "Cek Status" dengan nomor pendaftaran, atau melalui halaman "Pengumuman".`,
  },
] as const;

export const TIMELINE_STEPS = [
  {
    step: 1,
    title: "Registrasi Online",
    description: "Isi formulir pendaftaran dan unggah dokumen persyaratan",
    iconId: "register",
    date: `${IMPORTANT_DATES.registrationStart} – ${IMPORTANT_DATES.registrationEnd}`,
  },
  {
    step: 2,
    title: "Verifikasi Dokumen",
    description: "Panitia memeriksa kelengkapan dan keabsahan dokumen",
    iconId: "verify",
    date: IMPORTANT_DATES.documentVerification,
  },
  {
    step: 3,
    title: "Pembayaran OKB",
    description: "Transfer biaya OKB dan unggah bukti pembayaran",
    iconId: "pay",
    date: `Sebelum ${IMPORTANT_DATES.paymentDeadline}`,
  },
  {
    step: 4,
    title: "Tes OKB",
    description: "Observasi Kesiapan Belajar di sekolah secara tatap muka",
    iconId: "test",
    date: `${IMPORTANT_DATES.okbTestDate}, ${IMPORTANT_DATES.okbTestTime}`,
  },
  {
    step: 5,
    title: "Pengumuman Hasil",
    description: "Cek hasil seleksi melalui website atau halaman pengumuman",
    iconId: "result",
    date: IMPORTANT_DATES.announcementDate,
  },
] as const;
