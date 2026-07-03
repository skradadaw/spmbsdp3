CREATE TABLE IF NOT EXISTS public.pendaftar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_pendaftaran VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'menunggu_verifikasi' NOT NULL,
    jenis_pendaftaran VARCHAR(20) NOT NULL,
    pilihan_kelas VARCHAR(20) NOT NULL,
    punya_saudara VARCHAR(10) NOT NULL,
    nama_saudara VARCHAR(100),
    unit_saudara VARCHAR(50),
    kelas_saudara VARCHAR(50),
    
    nama_lengkap VARCHAR(150) NOT NULL,
    nama_panggilan VARCHAR(50) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    nisn VARCHAR(20),
    tempat_lahir VARCHAR(50) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(2) NOT NULL,
    agama VARCHAR(20) NOT NULL,
    kewarganegaraan VARCHAR(30) NOT NULL,
    anak_ke INTEGER NOT NULL,
    jumlah_saudara INTEGER NOT NULL,
    alamat TEXT NOT NULL,
    asal_sekolah VARCHAR(100) NOT NULL,
    
    memiliki_prestasi VARCHAR(10) NOT NULL,
    nama_prestasi VARCHAR(150),
    tingkat_prestasi VARCHAR(50),
    tahun_prestasi VARCHAR(4),
    
    nama_ayah VARCHAR(100) NOT NULL,
    nik_ayah VARCHAR(16) NOT NULL,
    pendidikan_ayah VARCHAR(50) NOT NULL,
    pekerjaan_ayah VARCHAR(100) NOT NULL,
    penghasilan_ayah VARCHAR(50) NOT NULL,
    no_hp_ayah VARCHAR(20) NOT NULL,
    
    nama_ibu VARCHAR(100) NOT NULL,
    nik_ibu VARCHAR(16) NOT NULL,
    pendidikan_ibu VARCHAR(50) NOT NULL,
    pekerjaan_ibu VARCHAR(100) NOT NULL,
    penghasilan_ibu VARCHAR(50) NOT NULL,
    no_hp_ibu VARCHAR(20) NOT NULL,
    
    sumber_informasi VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    nilai_okb DECIMAL(5,2),
    catatan_admin TEXT,
    is_locked BOOLEAN DEFAULT false NOT NULL
);

-- Trigger to update `updated_at` on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pendaftar_updated_at
    BEFORE UPDATE ON public.pendaftar
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
