"use client";

import { useState } from "react";
import { updateStatusPendaftar } from "../actions";

export function StatusChanger({ 
  pendaftarId, 
  currentStatus 
}: { 
  pendaftarId: string, 
  currentStatus: string 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const handleUpdate = async (newStatus: string, catatan?: string) => {
    setIsUpdating(true);
    const res = await updateStatusPendaftar(pendaftarId, newStatus, catatan);
    setIsUpdating(false);
    
    if (res.error) {
      alert(res.error);
    } else {
      setShowRejectForm(false);
      setRejectNote("");
    }
  };

  const getAvailableActions = () => {
    switch (currentStatus) {
      case "menunggu_verifikasi":
      case "ditolak_berkas": 
        return (
          <div className="flex flex-col gap-2">
            <button 
              className="btn btn-primary w-full justify-center"
              onClick={() => handleUpdate("terverifikasi")} 
              disabled={isUpdating}
            >
              {isUpdating ? 'Memproses...' : 'Verifikasi Berkas'}
            </button>
            <button 
              className="btn btn-secondary w-full justify-center"
              onClick={() => setShowRejectForm(true)} 
              disabled={isUpdating}
            >
              Tolak Berkas
            </button>
          </div>
        );
      case "terverifikasi":
        return (
          <div className="flex flex-col gap-2">
            <button 
              className="btn btn-primary w-full justify-center"
              onClick={() => handleUpdate("lulus_tes")} 
              disabled={isUpdating}
            >
              {isUpdating ? 'Memproses...' : 'Set Lulus Tes OKB'}
            </button>
            <button 
              className="btn btn-secondary w-full justify-center"
              onClick={() => handleUpdate("tidak_lulus_tes")} 
              disabled={isUpdating}
            >
              Set Tidak Lulus
            </button>
          </div>
        );
      case "lulus_tes":
        return (
          <div className="flex flex-col gap-2">
            <button 
              className="btn w-full justify-center text-white bg-[var(--color-success-600)] hover:bg-[var(--color-success-700)] focus:ring-[var(--color-success-100)]"
              onClick={() => handleUpdate("diterima")} 
              disabled={isUpdating}
            >
              {isUpdating ? 'Memproses...' : 'Selesaikan Pendaftaran'}
            </button>
          </div>
        );
      case "diterima":
      case "tidak_lulus_tes":
      case "tidak_diterima":
        return (
          <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-text-secondary)] text-sm font-medium text-center">
            Proses telah selesai.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="card p-6 border border-[var(--color-border)] shadow-sm bg-white rounded-xl">
      <h2 className="text-base font-bold text-[var(--color-primary-900)] m-0 mb-4 pb-3 border-b border-[var(--color-border-light)]">
        Tindakan Admin
      </h2>
      
      <div>
        {getAvailableActions()}
      </div>

      {showRejectForm && (
        <div className="mt-4 p-4 border border-[var(--color-danger-200)] bg-[var(--color-danger-50)] rounded-lg flex flex-col gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-danger-700)] mb-1">Alasan Penolakan</h4>
            <p className="text-xs text-[var(--color-danger-600)] m-0">
              Beritahu wali murid alasan berkas ditolak.
            </p>
          </div>
          
          <textarea 
            className="w-full p-2 border border-[var(--color-danger-200)] focus:border-[var(--color-danger-500)] focus:ring-4 focus:ring-[var(--color-danger-100)] outline-none rounded-md min-h-[60px] text-sm font-sans resize-y bg-white"
            placeholder="Ketik alasan penolakan..."
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
          
          <div className="flex gap-2">
            <button 
              className="btn w-full justify-center text-white bg-[var(--color-danger-600)] hover:bg-[var(--color-danger-700)] focus:ring-[var(--color-danger-100)] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleUpdate("ditolak_berkas", rejectNote)} 
              disabled={isUpdating || !rejectNote.trim()}
            >
              Tolak
            </button>
            <button 
              className="btn btn-secondary w-full justify-center"
              onClick={() => setShowRejectForm(false)} 
              disabled={isUpdating}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
