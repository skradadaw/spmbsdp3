"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Step3Data } from "@/lib/validations/registration";
import { PENDIDIKAN_OPTIONS, PENGHASILAN_OPTIONS, SUMBER_INFORMASI } from "@/lib/constants";

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

export function Step3({ onNext, onPrev }: Step3Props) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<Step3Data>();

  const handleNext = async () => {
    const isValid = await trigger([
      "namaAyah", "nikAyah", "tahunLahirAyah", "pendidikanAyah", "pekerjaanAyah", "penghasilanAyah", "noHpAyah",
      "namaIbu", "nikIbu", "tahunLahirIbu", "pendidikanIbu", "pekerjaanIbu", "penghasilanIbu", "noHpIbu",
      "sumberInformasi"
    ]);
    if (isValid) {
      onNext();
    } else {
      setTimeout(() => {
        const firstError = document.querySelector('.form-error, [aria-invalid="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-[var(--color-primary-900)] tracking-tight mb-2">
          Identitas Orang Tua / Wali
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Masukkan identitas dan data orang tua atau wali dengan benar untuk keperluan administrasi.
        </p>
        
        {/* Premium Divider */}
        <div className="mt-6 flex items-center">
          <div className="w-16 h-1.5 rounded-full bg-[var(--color-primary-500)] shadow-[0_0_10px_rgba(var(--color-primary-500-rgb),0.4)]"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2"></div>
        </div>
      </div>

      <div className="pt-2">

      {/* Ayah */}
      <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-sm">👨</span>
        Data Ayah Kandung
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Input
          label="Nama Lengkap Ayah"
          placeholder="Nama Lengkap"
          {...register("namaAyah")}
          error={errors.namaAyah?.message}
          required
        />
        <Input
          label="NIK Ayah"
          placeholder="16 Digit NIK"
          maxLength={16}
          {...register("nikAyah")}
          error={errors.nikAyah?.message}
          required
        />
        <Input
          label="Tahun Lahir Ayah"
          type="number"
          placeholder="Tahun Lahir"
          maxLength={4}
          {...register("tahunLahirAyah")}
          error={errors.tahunLahirAyah?.message}
          required
        />
        <Select
          label="Pendidikan Terakhir"
          options={PENDIDIKAN_OPTIONS.map(p => ({ value: p.value, label: p.label }))}
          placeholder="Pilih Pendidikan"
          {...register("pendidikanAyah")}
          error={errors.pendidikanAyah?.message}
          required
        />
        <Input
          label="Pekerjaan"
          placeholder="Pekerjaan"
          {...register("pekerjaanAyah")}
          error={errors.pekerjaanAyah?.message}
          required
        />
        <Select
          label="Penghasilan per Bulan"
          options={PENGHASILAN_OPTIONS.map(p => ({ value: p.value, label: p.label }))}
          placeholder="Pilih Rentang Penghasilan"
          {...register("penghasilanAyah")}
          error={errors.penghasilanAyah?.message}
          required
        />
        <Input
          label="No. WhatsApp / HP"
          type="tel"
          placeholder="08xxxxxxxxxx"
          {...register("noHpAyah")}
          error={errors.noHpAyah?.message}
          required
        />
      </div>

      {/* Ibu */}
      <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-sm">👩</span>
        Data Ibu Kandung
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Input
          label="Nama Lengkap Ibu"
          placeholder="Nama Lengkap"
          {...register("namaIbu")}
          error={errors.namaIbu?.message}
          required
        />
        <Input
          label="NIK Ibu"
          placeholder="16 Digit NIK"
          maxLength={16}
          {...register("nikIbu")}
          error={errors.nikIbu?.message}
          required
        />
        <Input
          label="Tahun Lahir Ibu"
          type="number"
          placeholder="Tahun Lahir"
          maxLength={4}
          {...register("tahunLahirIbu")}
          error={errors.tahunLahirIbu?.message}
          required
        />
        <Select
          label="Pendidikan Terakhir"
          options={PENDIDIKAN_OPTIONS.map(p => ({ value: p.value, label: p.label }))}
          placeholder="Pilih Pendidikan"
          {...register("pendidikanIbu")}
          error={errors.pendidikanIbu?.message}
          required
        />
        <Input
          label="Pekerjaan"
          placeholder="Pekerjaan"
          {...register("pekerjaanIbu")}
          error={errors.pekerjaanIbu?.message}
          required
        />
        <Select
          label="Penghasilan per Bulan"
          options={PENGHASILAN_OPTIONS.map(p => ({ value: p.value, label: p.label }))}
          placeholder="Pilih Rentang Penghasilan"
          {...register("penghasilanIbu")}
          error={errors.penghasilanIbu?.message}
          required
        />
        <Input
          label="No. WhatsApp / HP"
          type="tel"
          placeholder="08xxxxxxxxxx"
          {...register("noHpIbu")}
          error={errors.noHpIbu?.message}
          required
        />
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="col-span-full">
          <Select
            label="Darimana Anda mengetahui informasi SPMB SD Plus 3 Al-Muhajirin?"
            options={SUMBER_INFORMASI.map(s => ({ value: s.value, label: s.label }))}
            placeholder="Pilih Sumber Informasi"
            {...register("sumberInformasi")}
            error={errors.sumberInformasi?.message}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-10">
        <Button onClick={onPrev} variant="ghost" type="button">
          🡨 Kembali
        </Button>
        <Button onClick={handleNext} type="button">
          Selanjutnya ➔
        </Button>
      </div>
      </div>
    </div>
  );
}
