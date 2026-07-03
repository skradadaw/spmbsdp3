"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { JENIS_PENDAFTARAN, PILIHAN_KELAS, UNIT_SEKOLAH } from "@/lib/constants";
import { Step1Data } from "@/lib/validations/registration";
import { Books, BookOpenText, GlobeHemisphereWest, CheckCircle } from "@phosphor-icons/react";

const iconMap: Record<string, React.ReactNode> = {
  books: <Books size={32} weight="duotone" color="currentColor" />,
  "book-open": <BookOpenText size={32} weight="duotone" color="currentColor" />,
  globe: <GlobeHemisphereWest size={32} weight="duotone" color="currentColor" />,
};

interface Step1Props {
  onNext: () => void;
}

export function Step1({ onNext }: Step1Props) {
  const {
    register,
    trigger,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext<Step1Data>();

  const punyaSaudara = watch("punyaSaudara");
  const pilihanKelas = watch("pilihanKelas");
  const jenisPendaftaran = watch("jenisPendaftaran");

  const handleNext = async () => {
    let isValid = await trigger(["jenisPendaftaran", "pilihanKelas", "punyaSaudara", "namaSaudara", "unitSaudara", "kelasSaudara", "kelasTujuan"]);
    
    const currentKelasTujuan = watch("kelasTujuan");
    if (jenisPendaftaran === "pindahan" && (!currentKelasTujuan || currentKelasTujuan.trim() === "")) {
      setError("kelasTujuan", { type: "manual", message: "Mohon isi kelas tujuan untuk siswa pindahan" });
      isValid = false;
    }

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
          Kategori & Program
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Pilih program kelas dan lengkapi data awal pendaftaran.
        </p>
        
        {/* Premium Divider */}
        <div className="mt-6 flex items-center">
          <div className="w-16 h-1.5 rounded-full bg-[var(--color-primary-500)] shadow-[0_0_10px_rgba(var(--color-primary-500-rgb),0.4)]"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2"></div>
        </div>
      </div>

      <div className="pt-2">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-full">
            <RadioGroup
              label="Kategori Pendaftar"
              options={JENIS_PENDAFTARAN.map(j => ({ value: j.value, label: j.label }))}
              error={errors.jenisPendaftaran?.message}
              value={watch("jenisPendaftaran")}
              onValueChange={(val) => setValue("jenisPendaftaran", val as any)}
              required
            />
          </div>

          {jenisPendaftaran === "pindahan" && (
            <div className="col-span-full sm:col-span-1 animate-fade-in-up">
              <Input
                label="Masuk ke Kelas Berapa?"
                placeholder="Contoh: Kelas 3, Kelas 4, dst."
                {...register("kelasTujuan")}
                error={errors.kelasTujuan?.message}
                required
              />
            </div>
          )}

          <div className="col-span-full border-b border-gray-200/70 pb-4">
            <label className="form-label form-label-required mb-3 block">Program Kelas Pilihan</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PILIHAN_KELAS.map((kelas) => {
                const isSelected = pilihanKelas === kelas.value;
                return (
                  <div
                    key={kelas.value}
                    className={`group relative overflow-hidden rounded-[1.25rem] p-6 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border border-[var(--color-primary-500)] bg-gradient-to-br from-primary-50/80 to-white shadow-[0_8px_24px_-6px_rgba(var(--color-primary-500-rgb),0.2)] scale-[1.02] ring-1 ring-[var(--color-primary-500)]' 
                        : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'
                    }`}
                    onClick={() => setValue("pilihanKelas", kelas.value as any, { shouldValidate: true, shouldDirty: true })}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[var(--color-primary-500)] text-white shadow-[0_4px_12px_rgba(var(--color-primary-500-rgb),0.3)]' 
                        : 'bg-gray-50 text-[var(--color-primary-500)] group-hover:bg-primary-50 group-hover:scale-110'
                    }`}>
                      {iconMap[kelas.iconId]}
                    </div>
                    <div className={`font-bold text-xl tracking-tight mb-2 transition-colors ${
                      isSelected ? 'text-[var(--color-primary-800)]' : 'text-gray-800'
                    }`}>{kelas.label}</div>
                    <p className={`text-sm leading-relaxed transition-colors ${
                      isSelected ? 'text-[var(--color-primary-700)]' : 'text-gray-500'
                    }`}>{kelas.description}</p>
                    
                    {/* Selected Indicator */}
                    <div className={`absolute top-5 right-5 transition-all duration-300 ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}>
                      <CheckCircle size={28} weight="fill" className="text-[var(--color-primary-500)]" />
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.pilihanKelas && (
              <span className="form-error mt-1">{errors.pilihanKelas.message}</span>
            )}
          </div>

          <div className="col-span-full">
            <RadioGroup
              label="Apakah calon siswa memiliki saudara kandung yang sedang bersekolah di Al-Muhajirin?"
              options={[
                { value: "ya", label: "Ya" },
                { value: "tidak", label: "Tidak" },
              ]}
              error={errors.punyaSaudara?.message}
              value={watch("punyaSaudara")}
              onValueChange={(val) => setValue("punyaSaudara", val as any)}
              required
            />
          </div>

          {punyaSaudara === "ya" && (
            <>
              <div className="col-span-full">
                <div className="p-4 bg-info-50 border border-info-100 rounded-lg mb-2 text-sm text-info-700">
                  Silakan isi data saudara kandung yang sedang bersekolah di Al-Muhajirin. Jika lebih dari satu, tuliskan salah satu.
                </div>
              </div>
              <Input
                label="Nama Lengkap Saudara"
                {...register("namaSaudara")}
                error={errors.namaSaudara?.message}
                required
              />
              <Select
                label="Unit Sekolah Saudara"
                options={UNIT_SEKOLAH.map(u => ({ value: u.value, label: u.label }))}
                placeholder="Pilih Unit Sekolah"
                {...register("unitSaudara")}
                error={errors.unitSaudara?.message}
                required
              />
              <Input
                label="Kelas Saudara Saat Ini"
                placeholder="Contoh: 3A"
                {...register("kelasSaudara")}
                error={errors.kelasSaudara?.message}
                required
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-10">
          <div /> {/* Empty div to push next button to right */}
          <Button onClick={handleNext} type="button">
            Selanjutnya ➔
          </Button>
        </div>
      </div>
    </div>
  );
}
