import * as z from "zod";
import { PILIHAN_KELAS, MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from "../constants";

// Helper untuk format Title Case (Huruf Kapital di awal setiap kata)
const toTitleCase = (str: string | undefined) => {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|-|')\S/g, (match) => match.toUpperCase());
};

// Step 1: Kategori Pendaftaran
export const step1Schema = z.object({
  jenisPendaftaran: z.enum(["siswa_baru", "pindahan"], {
    message: "Mohon pilih jenis pendaftaran",
  }),
  pilihanKelas: z.enum(["reguler", "tahfidz", "english"], {
    message: "Mohon pilih program kelas",
  }),
  punyaSaudara: z.enum(["ya", "tidak"], {
    message: "Mohon pilih apakah memiliki saudara kandung di Al-Muhajirin",
  }),
  // Conditional fields if punyaSaudara === "ya"
  namaSaudara: z.string().optional().transform(toTitleCase),
  unitSaudara: z.string().optional(),
  kelasSaudara: z.string().optional(),
  
  // Conditional field if jenisPendaftaran === "pindahan"
  kelasTujuan: z.string().optional(),
}).refine((data) => {
  if (data.punyaSaudara === "ya") {
    return !!data.namaSaudara && !!data.unitSaudara && !!data.kelasSaudara;
  }
  return true;
}, {
  message: "Mohon lengkapi data saudara kandung terlebih dahulu",
  path: ["namaSaudara"], // Attach error to a field so it displays
}).refine((data) => {
  if (data.jenisPendaftaran === "pindahan") {
    return !!data.kelasTujuan;
  }
  return true;
}, {
  message: "Mohon isi kelas tujuan untuk siswa pindahan",
  path: ["kelasTujuan"],
});

// Step 2: Identitas Siswa
export const step2Schema = z.object({
  namaLengkap: z.string().min(3, "Mohon tuliskan nama lengkap calon siswa (min. 3 huruf)").transform(toTitleCase),
  namaPanggilan: z.string().min(2, "Mohon tuliskan nama panggilan").transform(toTitleCase),
  nik: z.string().length(16, "Mohon pastikan NIK berisi tepat 16 digit angka").regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  nisn: z.string().min(4, "Mohon isi NISN (minimal 4 digit angka)").regex(/^\d+$/, "NISN hanya boleh berisi angka"),
  jarakKeSekolah: z.string().min(1, "Mohon tuliskan jarak dari rumah ke sekolah"),
  tempatLahir: z.string().min(3, "Mohon isi tempat lahir").transform(toTitleCase),
  tanggalLahir: z.string().min(1, "Mohon lengkapi tanggal lahir"),
  jenisKelamin: z.enum(["L", "P"], { message: "Mohon pilih jenis kelamin" }),
  kewarganegaraan: z.string().min(1, "Mohon tuliskan kewarganegaraan"),
  anakKe: z.coerce.number().min(1, "Mohon isi data anak ke-berapa"),
  alamat: z.string().min(10, "Mohon tuliskan alamat lengkap dengan jelas"),
  asalSekolah: z.string().min(3, "Mohon tuliskan asal sekolah (TK/PAUD)").transform(toTitleCase),
  
  // Prestasi (Optional/Conditional)
  memilikiPrestasi: z.enum(["ya", "tidak"]),
  namaPrestasi: z.string().optional().transform(toTitleCase),
  tingkatPrestasi: z.string().optional(),
  tahunPrestasi: z.string().optional(),
}).refine((data) => {
  if (data.memilikiPrestasi === "ya") {
    return !!data.namaPrestasi && !!data.tingkatPrestasi && !!data.tahunPrestasi;
  }
  return true;
}, {
  message: "Mohon lengkapi detail data prestasi",
  path: ["namaPrestasi"],
});

// Step 3: Data Orang Tua
export const step3Schema = z.object({
  // Data Ayah
  namaAyah: z.string().min(3, "Mohon tuliskan nama lengkap Ayah").transform(toTitleCase),
  nikAyah: z.string().length(16, "Mohon pastikan NIK Ayah berisi tepat 16 digit").regex(/^\d+$/, "NIK Ayah hanya boleh berisi angka"),
  tahunLahirAyah: z.string().length(4, "Mohon isi tahun lahir dengan 4 angka (contoh: 1985)").regex(/^\d+$/, "Tahun lahir hanya boleh berisi angka"),
  pendidikanAyah: z.string().min(1, "Mohon pilih pendidikan terakhir Ayah"),
  pekerjaanAyah: z.string().min(1, "Mohon tuliskan pekerjaan Ayah"),
  penghasilanAyah: z.string().min(1, "Mohon pilih rentang penghasilan Ayah"),
  noHpAyah: z.string().min(10, "Mohon pastikan nomor HP Ayah minimal 10 digit").regex(/^\d+$/, "Nomor HP hanya boleh berisi angka"),
  
  // Data Ibu
  namaIbu: z.string().min(3, "Mohon tuliskan nama lengkap Ibu").transform(toTitleCase),
  nikIbu: z.string().length(16, "Mohon pastikan NIK Ibu berisi tepat 16 digit").regex(/^\d+$/, "NIK Ibu hanya boleh berisi angka"),
  tahunLahirIbu: z.string().length(4, "Mohon isi tahun lahir dengan 4 angka (contoh: 1987)").regex(/^\d+$/, "Tahun lahir hanya boleh berisi angka"),
  pendidikanIbu: z.string().min(1, "Mohon pilih pendidikan terakhir Ibu"),
  pekerjaanIbu: z.string().min(1, "Mohon tuliskan pekerjaan Ibu"),
  penghasilanIbu: z.string().min(1, "Mohon pilih rentang penghasilan Ibu"),
  noHpIbu: z.string().min(10, "Mohon pastikan nomor HP Ibu minimal 10 digit").regex(/^\d+$/, "Nomor HP hanya boleh berisi angka"),
  
  sumberInformasi: z.string().min(1, "Mohon pilih dari mana Anda mengetahui informasi ini"),
});

// Helper for file validation in Zod (Browser environment only, as File is a web API)
const fileSchema = z.any()
  .refine((file) => file instanceof File, "Mohon unggah dokumen ini")
  .refine((file) => file?.size <= MAX_FILE_SIZE, "Maaf, ukuran file maksimal adalah 2MB")
  .refine((file) => ALLOWED_MIME_TYPES.includes(file?.type), "Maaf, format file ini belum didukung (gunakan PDF/JPG/PNG)");

// Step 4: Unggah Dokumen
export const step4Schema = z.object({
  aktaLahir: fileSchema,
  kartuKeluarga: fileSchema,
  pasFoto: fileSchema,
  buktiPembayaran: fileSchema,
  pernyataanBenar: z.literal(true, {
    error: "Mohon setujui pernyataan ini untuk melanjutkan",
  }),
});

// Full Schema
export const registrationSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
}).superRefine((data, ctx) => {
  // Transfer step refinements manually since shape doesn't carry them over
  if (data.punyaSaudara === "ya") {
    if (!data.namaSaudara || !data.unitSaudara || !data.kelasSaudara) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mohon lengkapi data saudara kandung terlebih dahulu",
        path: ["namaSaudara"],
      });
    }
  }
  
  if (data.jenisPendaftaran === "pindahan") {
    if (!data.kelasTujuan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mohon pilih kelas tujuan untuk siswa pindahan",
        path: ["kelasTujuan"],
      });
    }
  }
  
  if (data.memilikiPrestasi === "ya") {
    if (!data.namaPrestasi || !data.tingkatPrestasi || !data.tahunPrestasi) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mohon lengkapi detail data prestasi",
        path: ["namaPrestasi"],
      });
    }
  }
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type RegistrationData = z.infer<typeof registrationSchema>;
