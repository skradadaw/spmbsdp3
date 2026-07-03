import { getPendaftarDetail } from "../actions";
import Link from "next/link";
import { STATUS_PENDAFTARAN, PILIHAN_KELAS, SUMBER_INFORMASI, PENDIDIKAN_OPTIONS, PENGHASILAN_OPTIONS, JENIS_PENDAFTARAN } from "@/lib/constants";
import { StatusChanger } from "./status-changer";
import { EditableSection } from "./editable-section";
import { WhatsappButton } from "@/components/admin/whatsapp-button";
import { PdfGenerator } from "@/components/admin/pdf-generator";
import { notFound } from "next/navigation";
import {
  CaretLeft, CheckCircle, Clock, Trophy, Users, FileText, DownloadSimple, ArrowUpRight,
  User, Smiley, IdentificationCard, GenderIntersex, CalendarBlank, GlobeHemisphereWest, UsersThree, GraduationCap, Ticket, ChalkboardTeacher, UserCircle, Phone, Briefcase, Money, MapPin, Megaphone
} from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

export default async function AdminPendaftarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, dokumen, error } = await getPendaftarDetail(id);

  if (error || !data) {
    return notFound();
  }

  const statusInfo = STATUS_PENDAFTARAN[data.status as keyof typeof STATUS_PENDAFTARAN];
  const kelasLabel = PILIHAN_KELAS.find(k => k.value === data.pilihan_kelas)?.label || data.pilihan_kelas;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-8 min-h-screen">

      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 pb-5 border-b border-[var(--color-border-light)]">
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <Link href="/admin/pendaftar" className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] text-sm font-semibold flex items-center gap-1.5 transition-colors mb-1 w-fit">
            <CaretLeft size={16} weight="bold" />
            Kembali ke Daftar
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary-900)] m-0 tracking-tight">
              {data.nama_lengkap}
            </h1>
            <span className={`badge badge-${statusInfo?.color || 'neutral'} px-3 py-1.5 rounded-full text-sm font-bold border mt-1 md:mt-0`}>
              <span className={`badge-dot badge-dot-${statusInfo?.color || 'neutral'}`}></span>
              {statusInfo?.label || data.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <span className="text-[var(--color-text-secondary)] font-mono bg-[var(--color-bg-secondary)] px-2.5 py-0.5 rounded-md border border-[var(--color-border-light)] font-medium">
              ID: {data.nomor_pendaftaran}
            </span>
            <span className="text-[var(--color-text-muted)] flex items-center gap-1.5 font-medium">
              <Clock size={16} />
              {formatWaktuId(data.created_at)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center mt-3 md:mt-0 w-full md:w-auto md:justify-end">
          <PdfGenerator data={data} type="kartu" />
          {data.status === 'diterima' && (
            <PdfGenerator data={data} type="kelulusan" />
          )}
          <WhatsappButton
            phoneNumber={data.no_hp_ayah || data.no_hp_ibu || ''}
            parentName={data.nama_ayah || data.nama_ibu || 'Orang Tua/Wali'}
            studentName={data.nama_panggilan || data.nama_lengkap}
            status={data.status}
          />
        </div>
      </header>

      {/* Main Layout Grid - Landscape / 3 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* Kolom Utama: Data Calon Siswa & Orang Tua (Satu Card Landscape) */}
        <div className="xl:col-span-9">
          <section className="bg-white rounded-2xl border border-[var(--color-border-light)] shadow-sm overflow-hidden flex flex-col">

            {/* Bagian: Data Calon Siswa */}
            <div className="p-6 md:p-8 w-full">
              <EditableSection
                pendaftarId={data.id}
                title="Data Calon Siswa"
                accentColor="var(--color-primary-600)"
                fields={[
                  { label: "Nama Lengkap", dbKey: "nama_lengkap", value: data.nama_lengkap || "", required: true },
                  { label: "Nama Panggilan", dbKey: "nama_panggilan", value: data.nama_panggilan || "", required: true },
                  { label: "NIK", dbKey: "nik", value: data.nik || "", type: "number", required: true, minLength: 16, maxLength: 16 },
                  { label: "NISN", dbKey: "nisn", value: data.nisn || "", type: "number", required: true },
                  { label: "Jenis Kelamin", dbKey: "jenis_kelamin", value: data.jenis_kelamin || "", displayValue: data.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan', type: "select", options: [{ value: "L", label: "Laki-Laki" }, { value: "P", label: "Perempuan" }], required: true },
                  { label: "Tempat Lahir", dbKey: "tempat_lahir", value: data.tempat_lahir || "", required: true },
                  { label: "Tanggal Lahir", dbKey: "tanggal_lahir", value: data.tanggal_lahir || "", displayValue: formatTanggalId(data.tanggal_lahir), type: "date", required: true },
                  { label: "Kewarganegaraan", dbKey: "kewarganegaraan", value: data.kewarganegaraan || "", required: true },
                  { label: "Anak Ke", dbKey: "anak_ke", value: String(data.anak_ke || ""), type: "number", required: true },
                  { label: "Asal TK/PAUD", dbKey: "asal_sekolah", value: data.asal_sekolah || "", required: true },
                  { label: "Jenis Daftar", dbKey: "jenis_pendaftaran", value: data.jenis_pendaftaran || "", displayValue: data.jenis_pendaftaran?.replace('_', ' ').toUpperCase(), type: "select", options: JENIS_PENDAFTARAN.map(j => ({ value: j.value, label: j.label })), required: true },
                  ...(data.jenis_pendaftaran === 'pindahan' ? [{ label: "Kelas Tujuan", dbKey: "kelas_tujuan", value: data.kelas_tujuan || "", required: true }] : []),
                  { label: "Pilihan Kelas", dbKey: "pilihan_kelas", value: data.pilihan_kelas || "", displayValue: kelasLabel, type: "select", options: PILIHAN_KELAS.map(k => ({ value: k.value, label: k.label })), required: true },
                  { label: "Sumber Info", dbKey: "sumber_informasi", value: data.sumber_informasi || "", displayValue: SUMBER_INFORMASI.find(s => s.value === data.sumber_informasi)?.label || data.sumber_informasi, type: "select", options: SUMBER_INFORMASI.map(s => ({ value: s.value, label: s.label })), required: true },
                  { label: "Alamat", dbKey: "alamat", value: data.alamat || "", className: "col-span-full md:col-span-2 xl:col-span-3", type: "textarea", required: true },
                ]}
              />

              {data.memiliki_prestasi === 'ya' && (
                <div className="mt-8 p-4 bg-[var(--color-primary-50)] rounded-xl border border-[var(--color-primary-100)] flex gap-3 items-start">
                  <Trophy size={20} weight="duotone" className="text-[var(--color-primary-600)] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[var(--color-primary-700)] uppercase tracking-wider block mb-1">Prestasi</span>
                    <span className="text-sm font-semibold text-[var(--color-primary-900)]">{data.nama_prestasi} ({data.tingkat_prestasi} - {data.tahun_prestasi})</span>
                  </div>
                </div>
              )}

              {data.punya_saudara === 'ya' && (
                <div className="mt-4 p-4 bg-lime-50 rounded-xl border border-lime-200 flex gap-3 items-start">
                  <Users size={20} weight="duotone" className="text-lime-700 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-lime-700 uppercase tracking-wider block mb-1">Saudara di Al-Muhajirin</span>
                    <span className="text-sm font-semibold text-lime-900">{data.nama_saudara} (Unit: {data.unit_saudara?.toUpperCase()}, Kelas: {data.kelas_saudara})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Kategori: Data Ayah */}
            <div className="pt-4 md:pt-6 px-6 md:px-8 pb-6 md:pb-8 w-full">
              <EditableSection
                pendaftarId={data.id}
                title="Data Ayah"
                accentColor="var(--color-accent-600)"
                fields={[
                  { label: "Nama Ayah", dbKey: "nama_ayah", value: data.nama_ayah || "", required: true },
                  { label: "No. HP Ayah", dbKey: "no_hp_ayah", value: data.no_hp_ayah || "", displayValue: formatDisplayPhone(data.no_hp_ayah), type: "tel", required: true },
                  { label: "NIK Ayah", dbKey: "nik_ayah", value: data.nik_ayah || "", type: "number", required: true, minLength: 16, maxLength: 16 },
                  { label: "Tahun Lahir Ayah", dbKey: "tahun_lahir_ayah", value: data.tahun_lahir_ayah || "", type: "number", required: true },
                  { label: "Pendidikan Ayah", dbKey: "pendidikan_ayah", value: data.pendidikan_ayah || "", displayValue: PENDIDIKAN_OPTIONS.find(p => p.value === data.pendidikan_ayah)?.label || data.pendidikan_ayah?.toUpperCase(), type: "select", options: PENDIDIKAN_OPTIONS.map(p => ({ value: p.value, label: p.label })), required: true },
                  { label: "Pekerjaan Ayah", dbKey: "pekerjaan_ayah", value: data.pekerjaan_ayah || "", required: true },
                  { label: "Penghasilan Ayah", dbKey: "penghasilan_ayah", value: data.penghasilan_ayah || "", displayValue: PENGHASILAN_OPTIONS.find(p => p.value === data.penghasilan_ayah)?.label || data.penghasilan_ayah, type: "select", options: PENGHASILAN_OPTIONS.map(p => ({ value: p.value, label: p.label })), required: true },
                  { label: "Alamat", dbKey: "alamat", value: data.alamat || "", className: "col-span-full md:col-span-2", type: "textarea", required: true },
                ]}
              />
            </div>

            {/* Kategori: Data Ibu */}
            <div className="pt-4 md:pt-6 px-6 md:px-8 pb-6 md:pb-8 w-full">
              <EditableSection
                pendaftarId={data.id}
                title="Data Ibu"
                accentColor="var(--color-accent-600)"
                fields={[
                  { label: "Nama Ibu", dbKey: "nama_ibu", value: data.nama_ibu || "", required: true },
                  { label: "No. HP Ibu", dbKey: "no_hp_ibu", value: data.no_hp_ibu || "", displayValue: formatDisplayPhone(data.no_hp_ibu), type: "tel", required: true },
                  { label: "NIK Ibu", dbKey: "nik_ibu", value: data.nik_ibu || "", type: "number", required: true, minLength: 16, maxLength: 16 },
                  { label: "Tahun Lahir Ibu", dbKey: "tahun_lahir_ibu", value: data.tahun_lahir_ibu || "", type: "number", required: true },
                  { label: "Pendidikan Ibu", dbKey: "pendidikan_ibu", value: data.pendidikan_ibu || "", displayValue: PENDIDIKAN_OPTIONS.find(p => p.value === data.pendidikan_ibu)?.label || data.pendidikan_ibu?.toUpperCase(), type: "select", options: PENDIDIKAN_OPTIONS.map(p => ({ value: p.value, label: p.label })), required: true },
                  { label: "Pekerjaan Ibu", dbKey: "pekerjaan_ibu", value: data.pekerjaan_ibu || "", required: true },
                  { label: "Penghasilan Ibu", dbKey: "penghasilan_ibu", value: data.penghasilan_ibu || "", displayValue: PENGHASILAN_OPTIONS.find(p => p.value === data.penghasilan_ibu)?.label || data.penghasilan_ibu, type: "select", options: PENGHASILAN_OPTIONS.map(p => ({ value: p.value, label: p.label })), required: true },
                  { label: "Alamat", dbKey: "alamat", value: data.alamat || "", className: "col-span-full md:col-span-2", type: "textarea", required: true },
                ]}
              />
            </div>
          </section>
        </div>

        {/* Column 3: Tindakan & Dokumen */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          <StatusChanger pendaftarId={data.id} currentStatus={data.status} />

          <section className="bg-white rounded-xl border border-[var(--color-border-light)] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[var(--color-primary-900)] m-0 mb-4 pb-3 border-b border-[var(--color-border-light)] flex items-center gap-2">
              <FileText size={20} weight="duotone" className="text-[var(--color-primary-600)]" />
              Dokumen Pendukung
            </h2>

            {dokumen && dokumen.length > 0 ? (
              <div className="flex flex-col gap-3">
                {dokumen.map((doc: any) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-primary-50)] border border-[var(--color-border-light)] hover:border-[var(--color-primary-200)] rounded-lg transition-colors text-decoration-none"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 shrink-0 rounded-md bg-white border border-[var(--color-border-light)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary-600)] transition-colors">
                        <FileText size={16} weight="duotone" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary-700)] transition-colors truncate">
                        {doc.jenis_dokumen.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                      </span>
                    </div>
                    <ArrowUpRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-600)] shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-[var(--color-bg-secondary)] rounded-lg border border-dashed border-[var(--color-border)]">
                <FileText size={32} weight="duotone" className="text-[var(--color-text-muted)] mb-2" />
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">Belum ada dokumen yang diunggah.</span>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

function formatTanggalId(dateString?: string | null) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

function formatWaktuId(dateString?: string | null) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

function formatDisplayPhone(phone?: string | null) {
  if (!phone) return "-";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("62")) {
    clean = "0" + clean.substring(2);
  } else if (clean.startsWith("8")) {
    clean = "0" + clean;
  }
  return clean || "-";
}
