# Task List — Sistem SPMB SD Plus 3 Al-Muhajirin

---

## Phase 1: Project Scaffolding & Design System

- [ ] Task 1.1: Inisialisasi Next.js project
  - Acceptance: Project Next.js 15 (App Router, TypeScript) berjalan di localhost:3000
  - Verify: `npm run dev` berhasil, halaman default muncul
  - Files: package.json, tsconfig.json, next.config.ts, .env.local.example

- [ ] Task 1.2: Install dependencies
  - Acceptance: Semua package terinstall — @supabase/supabase-js, @supabase/ssr, zod, recharts, qrcode, jspdf
  - Verify: `npm ls` tidak ada missing dependencies
  - Files: package.json, package-lock.json

- [ ] Task 1.3: Setup Design System & Global Styles
  - Acceptance: CSS custom properties (colors, typography, spacing, shadows) terdefinisi, font Plus Jakarta Sans ter-load, CSS reset aktif
  - Verify: Dev server menampilkan halaman dengan font dan warna yang benar
  - Files: src/app/globals.css, src/app/layout.tsx

- [ ] Task 1.4: Build Reusable UI Components
  - Acceptance: Komponen Button, Input, Select, Textarea, Modal, Card, Badge tersedia dan styled
  - Verify: Render setiap komponen secara visual di dev, responsive di 360px
  - Files: src/components/ui/*.tsx, src/components/ui/*.module.css

---

## Phase 2: Supabase Setup & Database

- [x] Task 2.1: Setup Supabase Client Libraries
  - Acceptance: 3 client (browser, server, admin) terkonfigurasi, types ter-generate
  - Verify: Client bisa connect ke Supabase (test query sederhana)
  - Files: src/lib/supabase/client.ts, server.ts, admin.ts, src/lib/database.types.ts

- [x] Task 2.2: Create Database Migrations — Tabel Pendaftar
  - Acceptance: Tabel `pendaftar` terbuat dengan semua kolom sesuai spec
  - Verify: `npx supabase db push` sukses, tabel visible di Supabase dashboard
  - Files: supabase/migrations/001_create_pendaftar.sql

- [x] Task 2.3: Create Database Migrations — Tabel Dokumen, Pengaturan, Log
  - Acceptance: Tabel `dokumen`, `pengaturan`, `log_aktivitas` terbuat
  - Verify: Semua tabel visible di Supabase dashboard
  - Files: supabase/migrations/002_create_dokumen.sql, 003_create_pengaturan.sql, 004_create_log.sql

- [x] Task 2.4: Setup RLS Policies & Storage Bucket
  - Acceptance: RLS aktif di semua tabel, policies sesuai spec, bucket `dokumen-spmb` terkonfigurasi
  - Verify: Anon user bisa INSERT ke `pendaftar`, tidak bisa UPDATE. Authenticated user full access.
  - Files: supabase/migrations/005_rls_policies.sql, 006_storage.sql

- [x] Task 2.5: Seed Data Admin & Pengaturan
  - Acceptance: 1-2 akun admin tersedia via Supabase Auth, data pengaturan (kuota, jadwal, status) ter-seed
  - Verify: Bisa login dengan akun admin, `pengaturan` table berisi data default
  - Files: supabase/seed.sql

- [x] Task 2.6: Setup Constants & Validation Schemas
  - Acceptance: Zod schemas untuk 4 langkah formulir, konstanta (opsi penghasilan, pendidikan, sumber info)
  - Verify: Unit test — schema menerima data valid, menolak data invalid
  - Files: src/lib/validations.ts, src/lib/constants.ts

---

## Phase 3: Landing Page (SKIPPED - DELETED PER USER REQUEST)

- [x] Task 3.1: Build Hero Section
  - Acceptance: Hero dengan judul, tagline, badge status (Buka/Tutup dari DB), 2 tombol CTA, responsive
  - Verify: Visual test di 360px dan 1440px, badge berubah sesuai data pengaturan
  - Files: src/app/page.tsx, src/components/landing/hero.tsx, hero.module.css

- [x] Task 3.2: Build Timeline & Persyaratan Section
  - Acceptance: Timeline visual 5 tahap, daftar persyaratan dokumen dengan spesifikasi
  - Verify: Visual test di mobile, timeline readable tanpa horizontal scroll
  - Files: src/components/landing/timeline.tsx, src/components/landing/requirements.tsx

- [x] Task 3.3: Build Jadwal, Biaya, & Program Kelas Section
  - Acceptance: Jadwal penting tampil dari data pengaturan, info biaya & rekening, 3 cards program kelas
  - Verify: Visual test, data jadwal sesuai dengan tabel `pengaturan`
  - Files: src/components/landing/schedule.tsx, src/components/landing/fees.tsx, src/components/landing/program-cards.tsx

- [x] Task 3.4: Build FAQ & Kontak Section
  - Acceptance: FAQ accordion (min 5 pertanyaan), kontak WhatsApp, alamat, Google Maps embed
  - Verify: Accordion buka/tutup smooth, Google Maps load, WhatsApp link benar
  - Files: src/components/landing/faq.tsx, src/components/landing/contact.tsx

---

## Phase 4: Formulir Pendaftaran

- [x] Task 4.1: Build Multi-Step Form Controller & Step Indicator
  - Acceptance: Form container dengan state management 4 langkah, step indicator visual, navigasi Sebelumnya/Selanjutnya
  - Verify: Navigasi antar langkah smooth, step indicator update sesuai posisi
  - Files: src/app/pendaftaran/page.tsx, src/components/form/step-indicator.tsx

- [x] Task 4.2: Build Langkah 1 — Kategori Pendaftaran
  - Acceptance: Semua field sesuai spec (jenis, kelas, asal sekolah, saudara conditional, sumber info), validasi Zod
  - Verify: Conditional fields muncul/hilang sesuai pilihan, validasi error tampil
  - Files: src/components/form/langkah-1-kategori.tsx

- [x] Task 4.3: Build Langkah 2 — Identitas Siswa
  - Acceptance: Semua field sesuai spec (nama, NIK 16 digit, NISN, TTL, prestasi conditional), validasi Zod
  - Verify: NIK validasi 16 digit, prestasi conditional muncul, date picker berfungsi
  - Files: src/components/form/langkah-2-identitas.tsx

- [x] Task 4.4: Build Langkah 3 — Data Orang Tua
  - Acceptance: Data Ayah & Ibu (nama, NIK, tahun lahir, pekerjaan, penghasilan dropdown, pendidikan dropdown, HP, alamat)
  - Verify: Dropdown penghasilan & pendidikan sesuai opsi, HP validasi format 08xxx
  - Files: src/components/form/langkah-3-ortu.tsx

- [x] Task 4.5: Build Langkah 4 — Unggah Dokumen & File Upload Component
  - Acceptance: Upload 4 dokumen (Akta, KK, Foto, Bukti Bayar), validasi client-side (format & ukuran), preview, hapus/ganti
  - Verify: File > 5MB ditolak, .exe ditolak, preview gambar muncul, bisa hapus & ganti
  - Files: src/components/form/langkah-4-dokumen.tsx, src/components/form/file-upload.tsx

- [x] Task 4.6: Build API Route — Submit Pendaftaran
  - Acceptance: POST /api/pendaftaran — validasi server-side (Zod), generate nomor unik SPMB-2026-XXXX, insert ke DB, return nomor pendaftaran
  - Verify: Integration test — submit data valid → nomor unik ter-generate, data tersimpan di DB
  - Files: src/app/api/pendaftaran/route.ts, src/lib/utils.ts

- [x] Task 4.7: Build API Route — Upload Dokumen (Server-side Validation)
  - Acceptance: POST /api/upload — validasi magic bytes, re-check ukuran, rename ke UUID, upload ke Supabase Storage, insert ke tabel `dokumen`
  - Verify: Integration test — file valid ter-upload, file invalid (rename .exe→.pdf) ditolak
  - Files: src/app/api/upload/route.ts

- [x] Task 4.8: Build Halaman Sukses Pendaftaran
  - Acceptance: Tampilkan nomor pendaftaran (highlight), tombol download PDF, tombol cek status
  - Verify: Nomor pendaftaran tampil, tombol navigasi berfungsi
  - Files: src/components/form/success-page.tsx

---

## Phase 5: Cek Status & Bukti PDF

- [x] Task 5.1: Build Halaman Cek Status — Input & API
  - Acceptance: Input nomor pendaftaran, validasi format, GET /api/cek-status, tampilkan data ringkasan
  - Verify: Nomor valid → data tampil, nomor invalid → error message
  - Files: src/app/cek-status/page.tsx, src/app/api/cek-status/route.ts

- [x] Task 5.2: Build Progress Tracker & Status Detail
  - Acceptance: Timeline visual 5 tahap dengan status (✅/⏳/⬜), detail dokumen per item, catatan panitia, jadwal OKB
  - Verify: Progress tracker berubah sesuai status di DB, catatan tampil jika ada
  - Files: src/components/status/progress-tracker.tsx, src/components/status/status-detail.tsx

- [x] Task 5.3: Build Edit Data & Unggah Ulang Dokumen
  - Acceptance: Tombol edit (hanya jika is_locked=false), redirect ke form terisi. Unggah ulang per dokumen yang ditolak.
  - Verify: Edit tersedia sebelum verifikasi, terkunci setelah. Unggah ulang mengganti file di Storage.
  - Files: src/components/status/edit-button.tsx, src/components/status/reupload-form.tsx, PATCH /api/pendaftaran

- [x] Task 5.4: Build Bukti Pendaftaran PDF
  - Acceptance: Generate PDF dengan kop sekolah, data ringkasan, QR code (URL cek status), downloadable
  - Verify: PDF ter-download, QR code scannable → redirect ke halaman cek status
  - Files: src/app/api/bukti-pdf/route.ts

---

## Phase 6: Halaman Pengumuman Publik

- [ ] Task 6.1: Build Halaman Pengumuman
  - Acceptance: Tabel daftar diterima (nomor, nama, kelas), search by nama/nomor, tanpa data sensitif
  - Verify: Hanya pendaftar status "diterima" tampil, search berfungsi, NIK/alamat tidak bocor
  - Files: src/app/pengumuman/page.tsx

---

## Phase 7: Admin Auth & Layout

- [ ] Task 7.1: Build Admin Login Page
  - Acceptance: Form email + password, Supabase Auth signInWithPassword, redirect ke dashboard setelah login
  - Verify: Login berhasil dengan akun seed, gagal dengan kredensial salah
  - Files: src/app/admin/login/page.tsx

- [ ] Task 7.2: Build Auth Middleware
  - Acceptance: Semua route /admin/* (kecuali /admin/login) dilindungi, redirect ke login jika tidak authenticated
  - Verify: Akses /admin/dashboard tanpa login → redirect ke /admin/login
  - Files: src/middleware.ts

- [ ] Task 7.3: Build Admin Layout (Sidebar & Header)
  - Acceptance: Sidebar navigasi (Dashboard, Pendaftar, Pengaturan, Log, Logout), header dengan info admin, responsive (sidebar collapse di mobile)
  - Verify: Navigasi antar halaman admin smooth, sidebar collapse di mobile
  - Files: src/app/admin/layout.tsx, src/components/admin/sidebar.tsx, src/components/admin/header.tsx

---

## Phase 8: Admin — Kelola Pendaftar

- [ ] Task 8.1: Build Daftar Pendaftar (Tabel + Filter + Search)
  - Acceptance: Tabel semua pendaftar, filter (status, kelas, jenis), search (nama, nomor), pagination, klik → detail
  - Verify: Filter & search berfungsi, data sesuai DB, pagination benar
  - Files: src/app/admin/pendaftar/page.tsx, src/components/admin/data-table.tsx, GET /api/admin/pendaftar

- [ ] Task 8.2: Build Detail Pendaftar — View & Verifikasi Dokumen
  - Acceptance: Tampilkan semua data 4 langkah, lihat/download dokumen, tombol Setujui/Tolak per dokumen + catatan penolakan
  - Verify: Dokumen bisa di-preview, status berubah setelah verifikasi, catatan tersimpan, log tercatat
  - Files: src/app/admin/pendaftar/[id]/page.tsx, PATCH /api/admin/verifikasi

- [ ] Task 8.3: Build Detail Pendaftar — Input OKB, Ubah Status, Pindah Kelas
  - Acceptance: Input nilai OKB + catatan, dropdown ubah status, dropdown pindah kelas, catatan admin, share WhatsApp
  - Verify: Nilai OKB tersimpan, status berubah, kelas berubah, WhatsApp URL benar (wa.me/nomor?text=pesan)
  - Files: PATCH /api/admin/okb, PATCH /api/admin/pendaftar, src/lib/whatsapp.ts, src/components/admin/whatsapp-button.tsx

---

## Phase 9: Admin — Dashboard & Laporan

- [ ] Task 9.1: Build KPI Cards
  - Acceptance: Cards — Total vs Kuota (keseluruhan + per kelas), Menunggu Verifikasi, Sudah Tes OKB
  - Verify: Angka sesuai data DB, real-time update saat data berubah
  - Files: src/app/admin/dashboard/page.tsx, src/components/admin/kpi-card.tsx

- [ ] Task 9.2: Build Grafik Demografi
  - Acceptance: Pie chart rasio gender, bar chart asal sekolah (top 10), histogram usia
  - Verify: Chart render dengan data real dari DB, responsive di mobile
  - Files: src/components/admin/demographic-charts.tsx

- [ ] Task 9.3: Build Tabel Peringatan Dini
  - Acceptance: Tabel pendaftar dengan "Dokumen Menunggu" & "Pembayaran Menunggu", link ke detail, sorted by waktu daftar
  - Verify: Data sesuai filter status, klik link → ke detail pendaftar
  - Files: src/components/admin/warning-table.tsx

---

## Phase 10: Admin — Pengaturan & Fitur Lanjutan

- [ ] Task 10.1: Build Halaman Pengaturan
  - Acceptance: Toggle Buka/Tutup pendaftaran, input kuota per kelas, edit jadwal & biaya
  - Verify: Toggle mempengaruhi akses /pendaftaran, kuota update di KPI cards
  - Files: src/app/admin/pengaturan/page.tsx, GET/PATCH /api/admin/pengaturan

- [ ] Task 10.2: Build Ekspor Data (CSV/Excel)
  - Acceptance: Tombol ekspor di halaman daftar pendaftar, bisa filter sebelum ekspor, download CSV/Excel
  - Verify: File ter-download, data sesuai filter, format benar
  - Files: GET /api/admin/ekspor

- [ ] Task 10.3: Build Log Aktivitas Admin
  - Acceptance: Halaman tabel log kronologis (waktu, admin, aksi, target, detail), filter by aksi/admin
  - Verify: Semua aksi admin tercatat (verifikasi, OKB, status, kelas), filter berfungsi
  - Files: src/app/admin/log/page.tsx, GET /api/admin/log

---

## Phase 11: Security Hardening & Testing

- [ ] Task 11.1: Security Hardening
  - Acceptance: Rate limiting API, secure headers (CSP, HSTS, X-Frame-Options), file magic bytes validation, input sanitization audit
  - Verify: Rate limit test (spam requests → blocked), headers visible di response, malicious file rejected
  - Files: src/middleware.ts, next.config.ts, src/app/api/upload/route.ts

- [ ] Task 11.2: Unit & Integration Tests
  - Acceptance: Vitest tests — Zod schemas, utility functions, API routes (mock Supabase)
  - Verify: `npm run test` — all pass, coverage ≥ 80% untuk validasi & utils
  - Files: __tests__/unit/*.test.ts, __tests__/integration/*.test.ts, vitest.config.ts

- [ ] Task 11.3: E2E Tests
  - Acceptance: Playwright tests — pendaftaran happy path, cek status, admin flow, toggle pendaftaran
  - Verify: `npx playwright test` — all pass
  - Files: e2e/*.spec.ts, playwright.config.ts

---

## Phase 12: Deployment

- [ ] Task 12.1: Deploy ke Vercel
  - Acceptance: Project ter-deploy, environment variables terkonfigurasi, domain ppdb.sdplus3almuhajirin.com terhubung
  - Verify: Site accessible di production URL, semua fitur berfungsi, Lighthouse LCP < 3s
  - Files: vercel.json (jika perlu), README.md (panduan deployment & DNS)

---

## Summary

| Phase | Tasks | Est. Files | Priority |
|---|---|---|---|
| 1. Scaffolding & Design | 4 | 5-6 | 🔴 Critical |
| 2. Supabase & Database | 6 | 6-8 | 🔴 Critical |
| 3. Landing Page | 4 | 7-8 | 🟡 High |
| 4. Formulir Pendaftaran | 8 | 10-12 | 🔴 Critical |
| 5. Cek Status & PDF | 4 | 6-7 | 🟡 High |
| 6. Pengumuman Publik | 1 | 2-3 | 🟢 Medium |
| 7. Admin Auth & Layout | 3 | 4-5 | 🟡 High |
| 8. Admin Kelola Pendaftar | 3 | 6-8 | 🟡 High |
| 9. Admin Dashboard | 3 | 5-6 | 🟡 High |
| 10. Admin Pengaturan | 3 | 4-5 | 🟢 Medium |
| 11. Security & Testing | 3 | 5-8 | 🟡 High |
| 12. Deployment | 1 | 2-3 | 🔴 Critical |
| **Total** | **43** | **~65-80** | |
