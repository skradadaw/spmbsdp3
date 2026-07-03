"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Step2Data } from "@/lib/validations/registration";
import { PRESTASI_TINGKAT } from "@/lib/constants";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

export function Step2({ onNext, onPrev }: Step2Props) {
  const {
    register,
    trigger,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext<Step2Data>();

  const memilikiPrestasi = watch("memilikiPrestasi");

  const handleNext = async () => {
    let isValid = await trigger([
      "namaLengkap", "namaPanggilan", "nik", "nisn", "jarakKeSekolah", "tempatLahir", "tanggalLahir",
      "jenisKelamin", "kewarganegaraan", "anakKe", "alamat",
      "asalSekolah", "memilikiPrestasi", "namaPrestasi", "tingkatPrestasi", "tahunPrestasi"
    ]);

    if (memilikiPrestasi === "ya") {
      const namaPrestasi = watch("namaPrestasi");
      const tingkatPrestasi = watch("tingkatPrestasi");
      const tahunPrestasi = watch("tahunPrestasi");

      if (!namaPrestasi || namaPrestasi.trim() === "") {
        setError("namaPrestasi", { type: "manual", message: "Mohon isi nama prestasi" });
        isValid = false;
      }
      if (!tingkatPrestasi || tingkatPrestasi.trim() === "") {
        setError("tingkatPrestasi", { type: "manual", message: "Mohon pilih tingkat prestasi" });
        isValid = false;
      }
      if (!tahunPrestasi || tahunPrestasi.trim() === "") {
        setError("tahunPrestasi", { type: "manual", message: "Mohon isi tahun prestasi" });
        isValid = false;
      }
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
          Identitas Siswa
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Lengkapi data pribadi calon siswa sesuai dengan Akta Kelahiran dan Kartu Keluarga.
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
            <Input
              label="Nama Lengkap Siswa"
              placeholder="Sesuai Akta Kelahiran"
              {...register("namaLengkap")}
              error={errors.namaLengkap?.message}
              required
            />
          </div>

          <Input
            label="Nama Panggilan"
            placeholder="Nama Panggilan"
            {...register("namaPanggilan")}
            error={errors.namaPanggilan?.message}
            required
          />
          
          <Input
            label="NIK (Nomor Induk Kependudukan)"
            placeholder="16 Digit NIK"
            maxLength={16}
            {...register("nik")}
            error={errors.nik?.message}
            required
          />

          <Input
            label="NISN (Nomor Induk Siswa Nasional)"
            placeholder="Nomor Induk Siswa Nasional"
            {...register("nisn")}
            error={errors.nisn?.message}
            required
          />

          <Input
            label="Jarak ke Sekolah"
            placeholder="Contoh: 2 KM / 500 Meter"
            {...register("jarakKeSekolah")}
            error={errors.jarakKeSekolah?.message}
            required
          />

          <div className="col-span-full">
            <RadioGroup
              label="Jenis Kelamin"
              options={[
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ]}
              error={errors.jenisKelamin?.message}
              value={watch("jenisKelamin")}
              onValueChange={(val) => setValue("jenisKelamin", val as any)}
              required
            />
          </div>

          <Input
            label="Tempat Lahir"
            placeholder="Kota/Kabupaten"
            {...register("tempatLahir")}
            error={errors.tempatLahir?.message}
            required
          />

          <Input
            label="Tanggal Lahir"
            type="date"
            {...register("tanggalLahir")}
            error={errors.tanggalLahir?.message}
            required
          />

          <Input
            label="Kewarganegaraan"
            placeholder="WNI / WNA"
            {...register("kewarganegaraan")}
            error={errors.kewarganegaraan?.message}
            required
          />

          <Input
            label="Anak Ke"
            type="number"
            placeholder="Misal: 1"
            min="1"
            {...register("anakKe")}
            error={errors.anakKe?.message}
            required
          />

          <div className="col-span-full">
            <Input
              label="Alamat Lengkap Saat Ini"
              placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
              as="textarea"
              rows={3}
              {...register("alamat")}
              error={errors.alamat?.message}
              required
            />
          </div>

          <div className="col-span-full">
            <Input
              label="Asal Sekolah (TK/PAUD)"
              placeholder="Nama TK/PAUD"
              {...register("asalSekolah")}
              error={errors.asalSekolah?.message}
              required
            />
          </div>

          {/* Prestasi */}
          <div className="col-span-full mt-4">
            <RadioGroup
              label="Apakah calon siswa memiliki prestasi akademik/non-akademik?"
              options={[
                { value: "ya", label: "Ya" },
                { value: "tidak", label: "Tidak" },
              ]}
              error={errors.memilikiPrestasi?.message}
              value={watch("memilikiPrestasi")}
              onValueChange={(val) => setValue("memilikiPrestasi", val as any)}
              required
            />
          </div>

          {memilikiPrestasi === "ya" && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 mb-2 p-4 bg-primary-50 rounded-xl border border-primary-100/50">
              <div className="col-span-full">
                <Input
                  label="Nama Prestasi / Lomba"
                  placeholder="Contoh: Juara 1 Lomba Mewarnai Tingkat Kota"
                  {...register("namaPrestasi")}
                  error={errors.namaPrestasi?.message}
                  required
                />
              </div>
              <Select
                label="Tingkat Prestasi"
                options={PRESTASI_TINGKAT.map(t => ({ value: t.value, label: t.label }))}
                placeholder="Pilih Tingkat Prestasi"
                {...register("tingkatPrestasi")}
                error={errors.tingkatPrestasi?.message}
                required
              />
              <Input
                label="Tahun Diperoleh"
                placeholder="Contoh: 2025"
                maxLength={4}
                {...register("tahunPrestasi")}
                error={errors.tahunPrestasi?.message}
                required
              />
            </div>
          )}
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
