import { getPendaftarList } from "./actions";
import { ExcelExport } from "@/components/admin/excel-export";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { DataTable } from "./data-table";

export const dynamic = "force-dynamic";

export default async function AdminPendaftarPage() {
  const { data: pendaftar, error } = await getPendaftarList();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 bg-[var(--color-bg)] min-h-screen">
      <header className="flex flex-wrap justify-between items-end border-b border-[var(--color-border)] pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)] m-0 tracking-tight">Data Pendaftar</h1>
          <p className="text-[var(--color-text-secondary)] mt-1.5 font-medium text-sm">Kelola daftar calon siswa yang telah mengisi formulir.</p>
        </div>
        <div className="flex items-center gap-3">
          {pendaftar && <ExcelExport data={pendaftar} />}
        </div>
      </header>

      {error ? (
        <div className="p-4 bg-[var(--color-danger-50)] text-[var(--color-danger-700)] rounded-xl border border-[var(--color-danger-200)] flex gap-3 shadow-sm">
          <Warning size={24} weight="duotone" />
          <div>
            <p className="font-semibold m-0 text-sm">Gagal memuat data</p>
            <p className="text-xs m-0 mt-0.5">{error}</p>
          </div>
        </div>
      ) : (
        <DataTable initialData={pendaftar || []} />
      )}
    </div>
  );
}
