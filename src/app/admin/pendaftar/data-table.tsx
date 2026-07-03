"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MagnifyingGlass, Tray, CaretDown, ArrowsDownUp } from "@phosphor-icons/react";
import { STATUS_PENDAFTARAN, PILIHAN_KELAS } from "@/lib/constants";

type Pendaftar = {
  id: string;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  pilihan_kelas: string;
  status: string;
  created_at: string;
};

// Helper: Extract Initials from Name
function getInitials(name: string) {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Generate pastel colors based on string (for avatars)
function getAvatarColor(name: string) {
  const colors = [
    "bg-red-100 text-red-700",
    "bg-orange-100 text-orange-700",
    "bg-amber-100 text-amber-700",
    "bg-green-100 text-green-700",
    "bg-emerald-100 text-emerald-700",
    "bg-teal-100 text-teal-700",
    "bg-cyan-100 text-cyan-700",
    "bg-sky-100 text-sky-700",
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-purple-100 text-purple-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-pink-100 text-pink-700",
    "bg-rose-100 text-rose-700",
  ];

  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function DataTable({ initialData }: { initialData: Pendaftar[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterKelas, setFilterKelas] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // 1. Search filter
      const matchesSearch =
        item.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nomor_pendaftaran?.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Status filter
      const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;

      // 3. Kelas filter
      const matchesKelas = filterKelas === "ALL" || item.pilihan_kelas === filterKelas;

      return matchesSearch && matchesStatus && matchesKelas;
    });
  }, [initialData, searchQuery, filterStatus, filterKelas]);

  // Reset page to 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterKelas]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6">

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-sm">

        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
            <MagnifyingGlass size={20} weight="duotone" />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau nomor pendaftaran..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-secondary)] border-transparent focus:bg-white focus:border-[var(--color-primary-500)] focus:ring-4 focus:ring-[var(--color-primary-100)] rounded-lg text-sm transition-all outline-none text-[var(--color-text)] placeholder-[var(--color-text-muted)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Container */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          {/* Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              className="w-full appearance-none bg-[var(--color-bg-secondary)] border-transparent hover:border-[var(--color-border)] focus:bg-white focus:border-[var(--color-primary-500)] focus:ring-4 focus:ring-[var(--color-primary-100)] rounded-lg text-sm transition-all outline-none text-[var(--color-text)] font-semibold py-2.5 pl-4 pr-10 cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              {Object.entries(STATUS_PENDAFTARAN).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--color-text-muted)]">
              <CaretDown size={16} weight="bold" />
            </div>
          </div>

          {/* Kelas Filter */}
          <div className="relative w-full sm:w-40">
            <select
              className="w-full appearance-none bg-[var(--color-bg-secondary)] border-transparent hover:border-[var(--color-border)] focus:bg-white focus:border-[var(--color-primary-500)] focus:ring-4 focus:ring-[var(--color-primary-100)] rounded-lg text-sm transition-all outline-none text-[var(--color-text)] font-semibold py-2.5 pl-4 pr-10 cursor-pointer"
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
            >
              <option value="ALL">Semua Kelas</option>
              {PILIHAN_KELAS.map((kelas) => (
                <option key={kelas.value} value={kelas.value}>{kelas.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--color-text-muted)]">
              <CaretDown size={16} weight="bold" />
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="admin-table-container">
        {filteredData.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16 text-center">No</th>
                  <th>Data Pendaftar</th>
                  <th>Kelas</th>
                  <th>Status</th>
                  <th>Tanggal Daftar</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const no = (currentPage - 1) * itemsPerPage + index + 1;
                  const statusInfo = STATUS_PENDAFTARAN[item.status as keyof typeof STATUS_PENDAFTARAN];
                  const kelasLabel = PILIHAN_KELAS.find(k => k.value === item.pilihan_kelas)?.label || item.pilihan_kelas;

                  return (
                    <tr key={item.id}>
                      <td className="text-center font-mono text-sm text-[var(--color-text-muted)]">{no}</td>

                      {/* Name & ID */}
                      <td className="pl-4 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-inset ring-black/5 ${getAvatarColor(item.nama_lengkap)}`}>
                            {getInitials(item.nama_lengkap)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-[0.9rem] leading-snug">{item.nama_lengkap}</span>
                            <span className="font-mono text-[0.75rem] text-gray-500 tracking-wide mt-0.5">{item.nomor_pendaftaran}</span>
                          </div>
                        </div>
                      </td>

                      {/* Kelas */}
                      <td className="py-4">
                        <span className="inline-flex items-center text-[0.8rem] font-semibold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-md border border-gray-200/60 shadow-sm">
                          {kelasLabel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3">
                        <span className={`badge badge-${statusInfo?.color || 'neutral'}`}>
                          <span className={`badge-dot badge-dot-${statusInfo?.color || 'neutral'}`}></span>
                          {statusInfo?.label || item.status}
                        </span>
                      </td>

                      <td className="py-4">
                        <span className={`text-[0.85rem] font-medium text-gray-600`}>
                          {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(item.created_at))}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 text-right pr-4">
                        <Link
                          href={`/admin/pendaftar/${item.id}`}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-all shadow-sm focus:ring-2 focus:ring-primary-100 outline-none"
                        >
                          Buka Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state border-t border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] rounded-2xl flex items-center justify-center mb-4">
              <Tray size={32} weight="duotone" />
            </div>
            <h3 className="font-bold text-lg mb-1.5 text-[var(--color-text)]">Tidak ada data ditemukan</h3>
            <p className="text-[var(--color-text-secondary)] m-0 text-sm max-w-sm mx-auto">
              {initialData.length === 0
                ? "Belum ada calon siswa yang mengisi formulir pendaftaran."
                : "Tidak ada pendaftar yang cocok dengan filter atau kata kunci pencarian Anda."}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredData.length > 0 && totalPages > 1 && (
          <div className="p-4 border-t border-[var(--color-border-light)] flex items-center justify-between bg-white rounded-b-xl mt-[-1px]">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Halaman {currentPage} dari {totalPages} (Total {filteredData.length} data)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
