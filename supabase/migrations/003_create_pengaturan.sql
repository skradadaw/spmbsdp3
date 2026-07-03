CREATE TABLE IF NOT EXISTS public.pengaturan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kunci VARCHAR(50) NOT NULL UNIQUE,
    nilai JSONB NOT NULL,
    deskripsi TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_pengaturan_updated_at
    BEFORE UPDATE ON public.pengaturan
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
