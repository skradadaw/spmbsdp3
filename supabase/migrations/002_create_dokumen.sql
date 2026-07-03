CREATE TABLE IF NOT EXISTS public.dokumen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pendaftar_id UUID NOT NULL REFERENCES public.pendaftar(id) ON DELETE CASCADE,
    jenis_dokumen VARCHAR(50) NOT NULL, -- e.g., 'akta_lahir', 'kk', 'pas_foto', 'bukti_bayar'
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'menunggu_verifikasi' NOT NULL, -- menunggu_verifikasi, disetujui, ditolak
    catatan_penolakan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT unique_pendaftar_dokumen UNIQUE(pendaftar_id, jenis_dokumen)
);

CREATE TRIGGER update_dokumen_updated_at
    BEFORE UPDATE ON public.dokumen
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
