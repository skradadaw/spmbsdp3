"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Step1 } from "./step-1";
import { Step2 } from "./step-2";
import { Step3 } from "./step-3";
import { Step4 } from "./step-4";
import {
  registrationSchema,
  RegistrationData,
} from "@/lib/validations/registration";

const STEPS = [
  "Pilihan Program",
  "Data Calon Siswa",
  "Data Orang Tua/Wali",
  "Berkas & Selesai",
];

export function RegistrationForm({ settings = {} }: { settings?: Record<string, any> }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);

  const methods = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema) as any,
    mode: "onTouched",
    defaultValues: {
      jenisPendaftaran: undefined,
      pilihanKelas: undefined,
      punyaSaudara: undefined,
      jenisKelamin: undefined,
      memilikiPrestasi: undefined,
      pernyataanBenar: undefined,
    },
  });

  useEffect(() => {
    // Load saved data on mount
    const savedData = localStorage.getItem("spmb_registration_form");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Do not restore files
        delete parsed.aktaLahir;
        delete parsed.kartuKeluarga;
        delete parsed.pasFoto;
        delete parsed.buktiPembayaran;
        
        methods.reset({ ...methods.getValues(), ...parsed });
      } catch (e) {
        console.error("Gagal membaca data pendaftaran tersimpan", e);
      }
    }

    // Subscribe to changes and save to local storage
    const subscription = methods.watch((value) => {
      const toSave = { ...value };
      // Do not save files
      delete toSave.aktaLahir;
      delete toSave.kartuKeluarga;
      delete toSave.pasFoto;
      delete toSave.buktiPembayaran;
      
      localStorage.setItem("spmb_registration_form", JSON.stringify(toSave));
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // 1. Upload Files
      const uploadFile = async (file: File, type: string) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
          throw new Error(`Gagal mengunggah dokumen ${type}`);
        }
        
        const result = await res.json();
        return result.url;
      };

      const [aktaLahirUrl, kartuKeluargaUrl, pasFotoUrl, buktiPembayaranUrl] = await Promise.all([
        uploadFile(data.aktaLahir, 'akta_lahir'),
        uploadFile(data.kartuKeluarga, 'kk'),
        uploadFile(data.pasFoto, 'pas_foto'),
        uploadFile(data.buktiPembayaran, 'bukti_bayar')
      ]);

      // 2. Submit Registration Data
      const apiPayload = {
        step1: {
          jenisPendaftaran: data.jenisPendaftaran,
          pilihanKelas: data.pilihanKelas,
          punyaSaudara: data.punyaSaudara,
          namaSaudara: data.namaSaudara,
          unitSaudara: data.unitSaudara,
          kelasSaudara: data.kelasSaudara,
        },
        step2: {
          namaLengkap: data.namaLengkap,
          namaPanggilan: data.namaPanggilan,
          nik: data.nik,
          nisn: data.nisn,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          jenisKelamin: data.jenisKelamin,
          kewarganegaraan: data.kewarganegaraan,
          anakKe: data.anakKe,
          alamat: data.alamat.replace(/[\r\n]+/g, " ").trim(),
          asalSekolah: data.asalSekolah,
          memilikiPrestasi: data.memilikiPrestasi,
          namaPrestasi: data.namaPrestasi,
          tingkatPrestasi: data.tingkatPrestasi,
          tahunPrestasi: data.tahunPrestasi,
        },
        step3: {
          namaAyah: data.namaAyah,
          nikAyah: data.nikAyah,
          tahunLahirAyah: data.tahunLahirAyah,
          pendidikanAyah: data.pendidikanAyah,
          pekerjaanAyah: data.pekerjaanAyah,
          penghasilanAyah: data.penghasilanAyah,
          noHpAyah: data.noHpAyah,
          namaIbu: data.namaIbu,
          nikIbu: data.nikIbu,
          tahunLahirIbu: data.tahunLahirIbu,
          pendidikanIbu: data.pendidikanIbu,
          pekerjaanIbu: data.pekerjaanIbu,
          penghasilanIbu: data.penghasilanIbu,
          noHpIbu: data.noHpIbu,
          sumberInformasi: data.sumberInformasi,
        },
        step4: {
          aktaLahirUrl,
          kartuKeluargaUrl,
          pasFotoUrl,
          buktiPembayaranUrl,
        }
      };

      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Gagal menyimpan pendaftaran');
      }

      const result = await res.json();
      
      setRegistrationNumber(result.nomor_pendaftaran);
      setIsSuccess(true);
      // Hapus data tersimpan jika berhasil
      localStorage.removeItem("spmb_registration_form");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-8 md:p-12 text-center max-w-2xl mx-auto animate-fade-in-up">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256"><path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.51A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path></svg>
        </div>
        
        <h2 className="text-3xl font-extrabold text-[var(--color-primary-900)] mb-3 tracking-tight">
          Pendaftaran Berhasil!
        </h2>
        <p className="text-[var(--color-text-secondary)] font-medium text-lg mb-8 leading-relaxed px-4">
          Alhamdulillah, formulir pendaftaran calon siswa baru SD Plus 3 Al-Muhajirin telah berhasil kami terima dan masuk ke dalam sistem.
        </p>
        
        <div className="bg-primary-50/70 border border-primary-100 p-8 rounded-2xl mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-200/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <p className="text-sm text-[var(--color-primary-700)] font-bold mb-3 relative z-10 uppercase tracking-wider">
            Nomor Registrasi Anda
          </p>
          <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary-900)] tracking-widest relative z-10 drop-shadow-sm mb-5">
            {registrationNumber}
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/80 px-5 py-2.5 rounded-full border border-primary-100 shadow-sm relative z-10">
             <span className="text-xs text-[var(--color-danger-600)] font-bold bg-danger-50 px-2 py-0.5 rounded uppercase">Penting</span>
             <p className="text-xs text-[var(--color-text-secondary)] font-semibold">
               Simpan nomor ini untuk mengecek status pendaftaran & jadwal tes.
             </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl font-bold text-[var(--color-text-secondary)] bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm">
            Kembali ke Beranda
          </Link>
          <Link href="/cek-status" className="px-6 py-3 rounded-xl font-bold text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] transition-all shadow-md hover:shadow-lg">
            Cek Status Pendaftaran
          </Link>
        </div>
      </div>
    );
  }

  const onInvalid = () => {
    setTimeout(() => {
      const firstError = document.querySelector('.form-error, [aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)} noValidate className="bg-white/50 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden">
        
        {/* Form Content Area */}
        <div className="px-6 sm:px-12 md:px-16 pt-10 md:pt-12 pb-10 md:pb-14">
          {currentStep === 1 && <Step1 onNext={handleNext} />}
          {currentStep === 2 && <Step2 onNext={handleNext} onPrev={handlePrev} />}
          {currentStep === 3 && <Step3 onNext={handleNext} onPrev={handlePrev} />}
          {currentStep === 4 && <Step4 onPrev={handlePrev} isSubmitting={isSubmitting} settings={settings} />}
        </div>
      </form>
    </FormProvider>
  );
}
