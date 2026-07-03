-- Enable RLS on all tables
ALTER TABLE public.pendaftar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_aktivitas ENABLE ROW LEVEL SECURITY;

-- 1. Pendaftar Policies
-- Anonymous users can insert (register)
CREATE POLICY "Allow anonymous insert to pendaftar" 
ON public.pendaftar FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated users (admins) can view, update, delete pendaftar
CREATE POLICY "Allow authenticated full access to pendaftar" 
ON public.pendaftar FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Dokumen Policies
CREATE POLICY "Allow anonymous insert to dokumen"
ON public.dokumen FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to dokumen"
ON public.dokumen FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Pengaturan Policies
-- Anyone can read settings (for frontend to check if registration is open, quota, etc.)
CREATE POLICY "Allow public read on pengaturan"
ON public.pengaturan FOR SELECT USING (true);

-- Only authenticated admins can modify settings
CREATE POLICY "Allow authenticated full access to pengaturan"
ON public.pengaturan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Log Aktivitas
CREATE POLICY "Allow authenticated full access to log_aktivitas"
ON public.log_aktivitas FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Storage setup for dokumen-spmb
-- Assuming the bucket does not exist, insert it (needs to be run as superuser, or via dashboard).
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dokumen-spmb', 'dokumen-spmb', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Allow public viewing of dokumen-spmb"
ON storage.objects FOR SELECT USING (bucket_id = 'dokumen-spmb');

CREATE POLICY "Allow anon uploads to dokumen-spmb"
ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'dokumen-spmb');

CREATE POLICY "Allow admin full access to dokumen-spmb"
ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'dokumen-spmb') WITH CHECK (bucket_id = 'dokumen-spmb');
