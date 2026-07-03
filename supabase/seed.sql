-- Seed default settings for SPMB
INSERT INTO public.pengaturan (kunci, nilai, deskripsi) VALUES
('is_registration_open', 'true', 'Status pembukaan pendaftaran SPMB'),
('registration_fee', '250000', 'Biaya pendaftaran dan tes OKB'),
('bank_account', '{"bank": "BSI", "number": "1234567890", "name": "SD Plus 3 Al-Muhajirin"}', 'Informasi rekening pembayaran'),
('registration_schedule', '{"start": "2026-07-01", "end": "2026-08-30"}', 'Jadwal pendaftaran'),
('test_schedule', '"2026-09-05"', 'Jadwal tes OKB')
ON CONFLICT (kunci) DO NOTHING;
