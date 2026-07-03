export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pendaftar: {
        Row: {
          id: string
          nomor_pendaftaran: string
          status: string
          jenis_pendaftaran: string
          pilihan_kelas: string
          punya_saudara: string
          nama_saudara: string | null
          unit_saudara: string | null
          kelas_saudara: string | null
          kelas_tujuan: string | null
          nama_lengkap: string
          nama_panggilan: string
          nik: string
          nisn: string | null
          tempat_lahir: string
          tanggal_lahir: string
          jenis_kelamin: string
          agama: string
          kewarganegaraan: string
          anak_ke: number
          jumlah_saudara: number
          alamat: string
          asal_sekolah: string
          memiliki_prestasi: string
          nama_prestasi: string | null
          tingkat_prestasi: string | null
          tahun_prestasi: string | null
          nama_ayah: string
          nik_ayah: string
          tahun_lahir_ayah: string | null
          pendidikan_ayah: string
          pekerjaan_ayah: string
          penghasilan_ayah: string
          no_hp_ayah: string
          nama_ibu: string
          nik_ibu: string
          tahun_lahir_ibu: string | null
          pendidikan_ibu: string
          pekerjaan_ibu: string
          penghasilan_ibu: string
          no_hp_ibu: string
          sumber_informasi: string
          created_at: string
          updated_at: string
          nilai_okb: number | null
          catatan_admin: string | null
          is_locked: boolean
        }
        Insert: {
          id?: string
          nomor_pendaftaran: string
          status?: string
          jenis_pendaftaran: string
          pilihan_kelas: string
          punya_saudara: string
          nama_saudara?: string | null
          unit_saudara?: string | null
          kelas_saudara?: string | null
          kelas_tujuan?: string | null
          nama_lengkap: string
          nama_panggilan: string
          nik: string
          nisn?: string | null
          tempat_lahir: string
          tanggal_lahir: string
          jenis_kelamin: string
          agama: string
          kewarganegaraan: string
          anak_ke: number
          jumlah_saudara: number
          alamat: string
          asal_sekolah: string
          memiliki_prestasi: string
          nama_prestasi?: string | null
          tingkat_prestasi?: string | null
          tahun_prestasi?: string | null
          nama_ayah: string
          nik_ayah: string
          tahun_lahir_ayah?: string | null
          pendidikan_ayah: string
          pekerjaan_ayah: string
          penghasilan_ayah: string
          no_hp_ayah: string
          nama_ibu: string
          nik_ibu: string
          tahun_lahir_ibu?: string | null
          pendidikan_ibu: string
          pekerjaan_ibu: string
          penghasilan_ibu: string
          no_hp_ibu: string
          sumber_informasi: string
          created_at?: string
          updated_at?: string
          nilai_okb?: number | null
          catatan_admin?: string | null
          is_locked?: boolean
        }
        Update: Partial<Database['public']['Tables']['pendaftar']['Insert']>
      }
      dokumen: {
        Row: {
          id: string
          pendaftar_id: string
          jenis_dokumen: string
          file_url: string
          status: string
          catatan_penolakan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pendaftar_id: string
          jenis_dokumen: string
          file_url: string
          status?: string
          catatan_penolakan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['dokumen']['Insert']>
      }
      pengaturan: {
        Row: {
          id: string
          kunci: string
          nilai: Json
          deskripsi: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          kunci: string
          nilai: Json
          deskripsi?: string | null
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['pengaturan']['Insert']>
      }
      log_aktivitas: {
        Row: {
          id: string
          admin_id: string
          aksi: string
          target_tabel: string | null
          target_id: string | null
          detail: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          aksi: string
          target_tabel?: string | null
          target_id?: string | null
          detail?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['log_aktivitas']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
