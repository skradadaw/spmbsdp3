CREATE TABLE IF NOT EXISTS public.log_aktivitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    aksi VARCHAR(100) NOT NULL,
    target_tabel VARCHAR(50),
    target_id UUID,
    detail JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
