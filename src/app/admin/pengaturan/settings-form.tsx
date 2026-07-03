"use client";

import { useState } from "react";
import { updatePengaturan } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, any> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState("umum");
  const [gelombang, setGelombang] = useState<any[]>(settings.gelombang_pendaftaran || []);

  const [templateOkb, setTemplateOkb] = useState(
    typeof settings.template_surat_kelulusan_okb === 'object' ? settings.template_surat_kelulusan_okb : { url: "", fields: { nama: { x: 200, y: 500, size: 14 }, nomor_pendaftaran: { x: 200, y: 480, size: 12 } } }
  );
  
  const [templateBukti, setTemplateBukti] = useState(
    typeof settings.template_bukti_pendaftaran === 'object' ? settings.template_bukti_pendaftaran : { url: "", fields: { nama: { x: 200, y: 500, size: 14 }, nomor_pendaftaran: { x: 200, y: 480, size: 12 } } }
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    setMessage(null);
    const newValue = !settings.status_pendaftaran;
    
    const res = await updatePengaturan("status_pendaftaran", newValue, "Status Buka/Tutup Pendaftaran SPMB");
    if (res.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setSettings(prev => ({ ...prev, status_pendaftaran: newValue }));
      setMessage({ text: "Status pendaftaran berhasil diubah.", type: 'success' });
    }
    setIsUpdating(false);
  };

  const handleSaveUmum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updatePengaturan("tahun_ajaran", formData.get("tahun_ajaran"), "Tahun Ajaran Aktif");
      await updatePengaturan("kontak_bantuan", formData.get("kontak_bantuan"), "Nomor WA/Kontak Bantuan Publik");
      await updatePengaturan("gelombang_pendaftaran", gelombang, "Pengaturan Gelombang");
      
      setMessage({ text: "Pengaturan Umum berhasil disimpan.", type: 'success' });
    } catch (err: any) {
      setMessage({ text: "Gagal menyimpan pengaturan.", type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePembayaran = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updatePengaturan("biaya_pendaftaran", Number(formData.get("biaya_pendaftaran")), "Biaya pendaftaran");
      await updatePengaturan("rekening_bank", formData.get("rekening_bank"), "Nama Bank Tujuan");
      await updatePengaturan("rekening_nomor", formData.get("rekening_nomor"), "Nomor Rekening Tujuan");
      await updatePengaturan("rekening_nama", formData.get("rekening_nama"), "Atas Nama Rekening");
      setMessage({ text: "Pengaturan Pembayaran berhasil disimpan.", type: 'success' });
    } catch (err: any) {
      setMessage({ text: "Gagal menyimpan pengaturan.", type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePengumuman = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      await updatePengaturan("teks_pengumuman_dashboard", formData.get("teks_pengumuman_dashboard"), "Teks Pengumuman Dashboard");
      await updatePengaturan("template_wa_tagihan", formData.get("template_wa_tagihan"), "Template WA Tagihan");
      setMessage({ text: "Pengaturan Pengumuman & Notifikasi berhasil disimpan.", type: 'success' });
    } catch (err: any) {
      setMessage({ text: "Gagal menyimpan pengaturan.", type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    
    try {
      await updatePengaturan("template_surat_kelulusan_okb", templateOkb, "Template Surat Kelulusan OKB (PDF native)");
      await updatePengaturan("template_bukti_pendaftaran", templateBukti, "Template Bukti Pendaftaran (PDF native)");
      setMessage({ text: "Pengaturan Template Dokumen berhasil disimpan.", type: 'success' });
    } catch (err: any) {
      setMessage({ text: "Gagal menyimpan pengaturan.", type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'okb' | 'bukti') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        if (type === 'okb') {
          setTemplateOkb({ ...templateOkb, url: data.url });
        } else {
          setTemplateBukti({ ...templateBukti, url: data.url });
        }
        setMessage({ text: "File PDF berhasil diunggah.", type: 'success' });
      } else {
        setMessage({ text: data.error || "Gagal mengunggah file.", type: 'error' });
      }
    } catch (error) {
      setMessage({ text: "Gagal menghubungi server untuk upload.", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const addGelombang = () => {
    setGelombang([...gelombang, { id: Date.now().toString(), nama: `Gelombang ${gelombang.length + 1}`, mulai: "", selesai: "" }]);
  };

  const updateGelombang = (index: number, key: string, value: string) => {
    const newG = [...gelombang];
    newG[index][key] = value;
    setGelombang(newG);
  };

  const removeGelombang = (index: number) => {
    const newG = [...gelombang];
    newG.splice(index, 1);
    setGelombang(newG);
  };

  const textAreaClass = "w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {message && (
        <div className={`p-4 rounded-md border ${message.type === 'error' ? 'bg-[var(--color-danger-50)] text-[var(--color-danger-700)] border-[var(--color-danger-200)]' : 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[#bbf7d0]'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-[var(--color-border-light)] overflow-x-auto pb-2">
        {[
          { id: "umum", label: "Umum & Gelombang" },
          { id: "pembayaran", label: "Pembayaran" },
          { id: "pengumuman", label: "Pengumuman & WA" },
          { id: "template", label: "Template Dokumen (PDF)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMessage(null); }}
            className={`px-4 py-2 rounded-t-md font-medium text-sm transition-colors ${activeTab === tab.id ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-b-2 border-[var(--color-primary-600)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Umum & Gelombang */}
      {activeTab === "umum" && (
        <div className="flex flex-col gap-6">
          <section className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-[var(--radius-xl)] shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Status Pendaftaran</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Buka atau tutup akses pendaftaran ke publik secara manual.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${settings.status_pendaftaran ? 'text-[var(--color-success)]' : 'text-[var(--color-danger-600)]'}`}>
                {settings.status_pendaftaran ? "DIBUKA" : "DITUTUP"}
              </span>
              <Button type="button" variant={settings.status_pendaftaran ? "danger" : "primary"} onClick={handleToggleStatus} isLoading={isUpdating}>
                {settings.status_pendaftaran ? "Tutup Pendaftaran" : "Buka Pendaftaran"}
              </Button>
            </div>
          </section>

          <section className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-[var(--radius-xl)] shadow-sm">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Pengaturan Umum & Gelombang</h2>
            <form onSubmit={handleSaveUmum} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Tahun Ajaran" name="tahun_ajaran" defaultValue={settings.tahun_ajaran} placeholder="Contoh: 2026/2027" />
                <Input label="Kontak Bantuan (WhatsApp)" name="kontak_bantuan" defaultValue={settings.kontak_bantuan} placeholder="Contoh: 081234567890" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[var(--color-text)]">Gelombang Pendaftaran</h3>
                  <Button type="button" variant="secondary" onClick={addGelombang} size="sm">+ Tambah Gelombang</Button>
                </div>
                
                {gelombang.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-tertiary)] italic">Belum ada data gelombang.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {gelombang.map((g, idx) => (
                      <div key={g.id} className="flex flex-col md:flex-row gap-3 items-end p-4 border border-[var(--color-border-light)] rounded-lg bg-[var(--color-neutral-50)]">
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-medium mb-1">Nama Gelombang</label>
                          <input type="text" value={g.nama} onChange={e => updateGelombang(idx, "nama", e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                          <input type="date" value={g.mulai} onChange={e => updateGelombang(idx, "mulai", e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                          <input type="date" value={g.selesai} onChange={e => updateGelombang(idx, "selesai", e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <Button type="button" variant="danger" onClick={() => removeGelombang(idx)} className="w-full md:w-auto h-[42px]">Hapus</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-[var(--color-border-light)]">
                <Button type="submit" isLoading={isUpdating}>Simpan Pengaturan Umum</Button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Tab 2: Pembayaran */}
      {activeTab === "pembayaran" && (
        <section className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-[var(--radius-xl)] shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Pengaturan Pembayaran</h2>
          <form onSubmit={handleSavePembayaran} className="flex flex-col gap-6">
            <Input label="Biaya Pendaftaran (Rp)" type="number" name="biaya_pendaftaran" defaultValue={settings.biaya_pendaftaran} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Bank Tujuan" name="rekening_bank" defaultValue={settings.rekening_bank} placeholder="Contoh: Bank BSI" />
              <Input label="Nomor Rekening" name="rekening_nomor" defaultValue={settings.rekening_nomor} placeholder="Contoh: 1234567890" />
              <Input label="Atas Nama" name="rekening_nama" defaultValue={settings.rekening_nama} placeholder="Contoh: SD Plus 3 Al-Muhajirin" />
            </div>
            <div className="flex justify-end pt-4 border-t border-[var(--color-border-light)]">
              <Button type="submit" isLoading={isUpdating}>Simpan Pembayaran</Button>
            </div>
          </form>
        </section>
      )}

      {/* Tab 3: Pengumuman & Notifikasi */}
      {activeTab === "pengumuman" && (
        <section className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-[var(--radius-xl)] shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Pengumuman & Notifikasi WA</h2>
          <form onSubmit={handleSavePengumuman} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Teks Pengumuman di Dashboard Pendaftar</label>
              <textarea name="teks_pengumuman_dashboard" rows={3} className={textAreaClass} defaultValue={settings.teks_pengumuman_dashboard} />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Template WA Tagihan Pendaftaran</label>
              <textarea name="template_wa_tagihan" rows={6} className={textAreaClass} defaultValue={settings.template_wa_tagihan} />
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Variabel tersedia: <code className="bg-neutral-100 px-1 rounded">{"{{nama}}"}</code>, <code className="bg-neutral-100 px-1 rounded">{"{{biaya}}"}</code>, <code className="bg-neutral-100 px-1 rounded">{"{{batas_bayar}}"}</code>.</p>
            </div>
            <div className="flex justify-end pt-4 border-t border-[var(--color-border-light)]">
              <Button type="submit" isLoading={isUpdating}>Simpan Pengumuman</Button>
            </div>
          </form>
        </section>
      )}

      {/* Tab 4: Template Cetak Dokumen */}
      {activeTab === "template" && (
        <section className="bg-[var(--color-bg)] border border-[var(--color-border)] p-6 rounded-[var(--radius-xl)] shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Template Cetak Dokumen (PDF Native)</h2>
          <div className="mb-6 text-sm text-[var(--color-text-secondary)] bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200">
            <strong>Info:</strong> Upload file PDF desain kosong (template). Teks dinamis seperti Nama dan Nomor Pendaftaran akan dicetak di atas file PDF tersebut. Tentukan posisi teks menggunakan koordinat X (mendatar) dan Y (menurun dari bawah, standar PDF).
          </div>
          <form onSubmit={handleSaveTemplate} className="flex flex-col gap-8">
            
            <div className="border border-[var(--color-border-light)] p-5 rounded-lg">
              <h3 className="font-bold text-[var(--color-text)] mb-4 text-lg">1. Surat Bukti Pendaftaran</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Upload File Template PDF</label>
                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'bukti')} disabled={isUploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 border rounded-md" />
                  {templateBukti.url && <p className="text-xs text-green-600 mt-2 font-medium">✓ File terunggah: <a href={templateBukti.url} target="_blank" rel="noreferrer" className="underline">Lihat PDF</a></p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-neutral-50 p-3 rounded border">
                    <h4 className="text-sm font-semibold mb-2">Posisi Teks "Nama"</h4>
                    <div className="flex gap-2">
                      <Input label="X" type="number" value={templateBukti.fields.nama.x} onChange={e => setTemplateBukti({...templateBukti, fields: {...templateBukti.fields, nama: {...templateBukti.fields.nama, x: Number(e.target.value)}}})} />
                      <Input label="Y" type="number" value={templateBukti.fields.nama.y} onChange={e => setTemplateBukti({...templateBukti, fields: {...templateBukti.fields, nama: {...templateBukti.fields.nama, y: Number(e.target.value)}}})} />
                      <Input label="Size" type="number" value={templateBukti.fields.nama.size} onChange={e => setTemplateBukti({...templateBukti, fields: {...templateBukti.fields, nama: {...templateBukti.fields.nama, size: Number(e.target.value)}}})} />
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded border">
                    <h4 className="text-sm font-semibold mb-2">Posisi Teks "No Pendaftaran"</h4>
                    <div className="flex gap-2">
                      <Input label="X" type="number" value={templateBukti.fields.nomor_pendaftaran.x} onChange={e => setTemplateBukti({...templateBukti, fields: {...templateBukti.fields, nomor_pendaftaran: {...templateBukti.fields.nomor_pendaftaran, x: Number(e.target.value)}}})} />
                      <Input label="Y" type="number" value={templateBukti.fields.nomor_pendaftaran.y} onChange={e => setTemplateBukti({...templateBukti, fields: {...templateBukti.fields, nomor_pendaftaran: {...templateBukti.fields.nomor_pendaftaran, y: Number(e.target.value)}}})} />
                      <Input label="Size" type="number" value={templateBukti.fields.nomor_pendaftaran.size} onChange={e => setTemplateBukti({...templateBukti, fields: {...templateBukti.fields, nomor_pendaftaran: {...templateBukti.fields.nomor_pendaftaran, size: Number(e.target.value)}}})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[var(--color-border-light)] p-5 rounded-lg">
              <h3 className="font-bold text-[var(--color-text)] mb-4 text-lg">2. Surat Kelulusan OKB</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-text)] mb-1">Upload File Template PDF</label>
                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'okb')} disabled={isUploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 border rounded-md" />
                  {templateOkb.url && <p className="text-xs text-green-600 mt-2 font-medium">✓ File terunggah: <a href={templateOkb.url} target="_blank" rel="noreferrer" className="underline">Lihat PDF</a></p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-neutral-50 p-3 rounded border">
                    <h4 className="text-sm font-semibold mb-2">Posisi Teks "Nama"</h4>
                    <div className="flex gap-2">
                      <Input label="X" type="number" value={templateOkb.fields.nama.x} onChange={e => setTemplateOkb({...templateOkb, fields: {...templateOkb.fields, nama: {...templateOkb.fields.nama, x: Number(e.target.value)}}})} />
                      <Input label="Y" type="number" value={templateOkb.fields.nama.y} onChange={e => setTemplateOkb({...templateOkb, fields: {...templateOkb.fields, nama: {...templateOkb.fields.nama, y: Number(e.target.value)}}})} />
                      <Input label="Size" type="number" value={templateOkb.fields.nama.size} onChange={e => setTemplateOkb({...templateOkb, fields: {...templateOkb.fields, nama: {...templateOkb.fields.nama, size: Number(e.target.value)}}})} />
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded border">
                    <h4 className="text-sm font-semibold mb-2">Posisi Teks "No Pendaftaran"</h4>
                    <div className="flex gap-2">
                      <Input label="X" type="number" value={templateOkb.fields.nomor_pendaftaran.x} onChange={e => setTemplateOkb({...templateOkb, fields: {...templateOkb.fields, nomor_pendaftaran: {...templateOkb.fields.nomor_pendaftaran, x: Number(e.target.value)}}})} />
                      <Input label="Y" type="number" value={templateOkb.fields.nomor_pendaftaran.y} onChange={e => setTemplateOkb({...templateOkb, fields: {...templateOkb.fields, nomor_pendaftaran: {...templateOkb.fields.nomor_pendaftaran, y: Number(e.target.value)}}})} />
                      <Input label="Size" type="number" value={templateOkb.fields.nomor_pendaftaran.size} onChange={e => setTemplateOkb({...templateOkb, fields: {...templateOkb.fields, nomor_pendaftaran: {...templateOkb.fields.nomor_pendaftaran, size: Number(e.target.value)}}})} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--color-border-light)]">
              <Button type="submit" isLoading={isUpdating}>Simpan Pengaturan Template</Button>
            </div>
          </form>
        </section>
      )}

    </div>
  );
}
