"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlass, Funnel, ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr";

interface LogTableProps {
  initialLogs: any[];
}

export function LogTable({ initialLogs }: LogTableProps) {
  const renderDetail = (detail: any) => {
    if (!detail) return <span className="text-sm text-gray-400 italic">Tidak ada detail</span>;
    
    if (detail.fields_updated && Array.isArray(detail.fields_updated)) {
      const formattedFields = detail.fields_updated.map((field: string) => 
        field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      );
      return (
        <div className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Mengedit kolom: </span>
          {formattedFields.join(', ')}
        </div>
      );
    }
    
    if (detail.status_baru) {
      return (
        <div className="text-sm text-gray-700 flex flex-col gap-1">
          <div>
            <span className="font-semibold text-gray-900">Status Baru: </span>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
              {detail.status_baru.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          {detail.catatan_admin && (
            <div><span className="font-semibold text-gray-900">Catatan: </span>{detail.catatan_admin}</div>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-1">
        {Object.entries(detail).map(([key, val]) => (
          <div key={key} className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900 capitalize">{key.replace(/_/g, ' ')}: </span>
            <span>{String(val)}</span>
          </div>
        ))}
      </div>
    );
  };

  const [filterAksi, setFilterAksi] = useState<string>("all");
  const [filterTarget, setFilterTarget] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique values for filters
  const uniqueAksi = Array.from(new Set(initialLogs.map(log => log.aksi))).filter(Boolean);
  const uniqueTarget = Array.from(new Set(initialLogs.map(log => log.target_tabel))).filter(Boolean);

  const filteredLogs = useMemo(() => {
    return initialLogs.filter((log) => {
      const matchAksi = filterAksi === "all" || log.aksi === filterAksi;
      const matchTarget = filterTarget === "all" || log.target_tabel === filterTarget;
      const matchSearch = searchQuery === "" || 
        (log.detail && JSON.stringify(log.detail).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.target_id && log.target_id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchAksi && matchTarget && matchSearch;
    });
  }, [initialLogs, filterAksi, filterTarget, searchQuery]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filterAksi, filterTarget, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border-light)] shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
          <MagnifyingGlass size={20} className="text-gray-400 ml-2" />
          <input 
            type="text" 
            placeholder="Cari dalam detail atau ID target..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Funnel size={18} className="text-gray-500" />
            <select 
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-primary-500"
              value={filterAksi}
              onChange={(e) => setFilterAksi(e.target.value)}
            >
              <option value="all">Semua Aksi</option>
              {uniqueAksi.map((aksi: any) => (
                <option key={aksi} value={aksi}>{aksi}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-primary-500"
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
            >
              <option value="all">Semua Target</option>
              {uniqueTarget.map((target: any) => (
                <option key={target} value={target}>{target}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] shadow-sm overflow-hidden">
        {filteredLogs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--color-border-light)]">
                  <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Waktu</th>
                  <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Admin ID</th>
                  <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Aksi & Target</th>
                  <th className="py-3 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider">Detail Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-light)]">
                {paginatedLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap align-top">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(log.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <ClockCounterClockwise size={14} />
                        {new Date(log.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {log.admin_id?.substring(0, 8)}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          log.aksi.includes('UPDATE') || log.aksi.includes('EDIT') ? 'bg-blue-100 text-blue-800' :
                          log.aksi.includes('INSERT') || log.aksi.includes('CREATE') ? 'bg-green-100 text-green-800' :
                          log.aksi.includes('DELETE') ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.aksi.replace(/_/g, ' ')}
                        </span>
                        <div className="text-sm font-semibold text-gray-700 mt-1 capitalize">
                          {log.target_tabel ? log.target_tabel.replace(/_/g, ' ') : '-'}
                        </div>
                        {log.target_name ? (
                          <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-sm font-bold text-gray-900">{log.target_name}</span>
                            <span className="text-xs font-mono text-gray-500">{log.target_no || log.target_id.substring(0, 8)}</span>
                          </div>
                        ) : log.target_id && (
                          <div className="text-xs font-mono text-gray-500 truncate max-w-[150px] mt-1" title={log.target_id}>
                            ID: {log.target_id}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        {renderDetail(log.detail)}
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-[var(--color-border-light)] flex items-center justify-between bg-gray-50/50">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Halaman {currentPage} dari {totalPages}
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Funnel size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak ada log yang sesuai</h3>
            <p className="text-sm text-gray-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
