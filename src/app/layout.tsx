import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SPMB SD Plus 3 Al-Muhajirin Purwakarta — TA 2026/2027",
    template: "%s | SPMB SD Plus 3 Al-Muhajirin",
  },
  description:
    "Sistem Seleksi Penerimaan Murid Baru (SPMB) SD Plus 3 Al-Muhajirin Purwakarta Tahun Ajaran 2026/2027. Daftar online, cek status pendaftaran, dan lihat pengumuman hasil.",
  keywords: [
    "SPMB",
    "SD Plus 3 Al-Muhajirin",
    "Purwakarta",
    "pendaftaran siswa baru",
    "2026",
    "2027",
  ],
  authors: [{ name: "SD Plus 3 Al-Muhajirin Purwakarta" }],
  openGraph: {
    title: "SPMB SD Plus 3 Al-Muhajirin Purwakarta — TA 2026/2027",
    description:
      "Daftar online Seleksi Penerimaan Murid Baru SD Plus 3 Al-Muhajirin Purwakarta.",
    url: "https://ppdb.sdplus3almuhajirin.com",
    siteName: "SPMB SD Plus 3 Al-Muhajirin",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3a8c6e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased font-sans text-[var(--color-text)] bg-[var(--color-bg)] min-h-screen">
        {children}
      </body>
    </html>
  );
}
