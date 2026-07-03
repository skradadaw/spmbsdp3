import { getLogAktivitas } from "./actions";
import { LogTable } from "./log-client";

export const dynamic = "force-dynamic";

export default async function AdminLogPage() {
  const { data: logs, error } = await getLogAktivitas();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 bg-[var(--color-bg)] min-h-screen">
      <header className="flex flex-wrap justify-between items-end border-b border-[var(--color-border)] pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)] m-0 tracking-tight">Log Aktivitas</h1>
          <p className="text-[var(--color-text-secondary)] mt-1.5 font-medium text-sm">Rekaman histori tindakan yang dilakukan dalam sistem.</p>
        </div>
      </header>

      {error ? (
        <div className="p-4 bg-[var(--color-danger-50)] text-[var(--color-danger-700)] rounded-xl border border-[var(--color-danger-200)] flex gap-3 shadow-sm">
          <span className="text-xl">⚠️</span> 
          <div>
            <p className="font-semibold m-0 text-sm">Gagal memuat log</p>
            <p className="text-xs m-0 mt-0.5">{error}</p>
          </div>
        </div>
      ) : (
        <LogTable initialLogs={logs || []} />
      )}
    </div>
  );
}
