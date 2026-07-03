"use client";

import { useFormContext } from "react-hook-form";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Step4Data } from "@/lib/validations/registration";
import { DOCUMENT_TYPES, REGISTRATION_FEE } from "@/lib/constants";

interface Step4Props {
  onPrev: () => void;
  isSubmitting: boolean;
  settings?: Record<string, any>;
}

export function Step4({ onPrev, isSubmitting, settings = {} }: Step4Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<Step4Data>();

  const formValues = watch();

  const feeAmount = settings.biaya_pendaftaran || REGISTRATION_FEE.amount;
  const formattedFee = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(feeAmount);

  const bankName = settings.rekening_bank || REGISTRATION_FEE.bankName;
  const accountNumber = settings.rekening_nomor || REGISTRATION_FEE.accountNumber;
  const accountHolder = settings.rekening_nama || REGISTRATION_FEE.accountHolder;

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-[var(--color-primary-900)] tracking-tight mb-2">
          Unggah Dokumen & Konfirmasi
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Unggah dokumen persyaratan dan bukti pembayaran OKB untuk menyelesaikan pendaftaran.
        </p>
        
        {/* Premium Divider */}
        <div className="mt-6 flex items-center">
          <div className="w-16 h-1.5 rounded-full bg-[var(--color-primary-500)] shadow-[0_0_10px_rgba(var(--color-primary-500-rgb),0.4)]"></div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-2"></div>
        </div>
      </div>

      <div className="pt-2">

      {/* Info Pembayaran OKB */}
      <div className="relative overflow-hidden bg-white border border-primary-100 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm transition-all hover:shadow-md">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-50 rounded-full blur-2xl -ml-10 -mb-10 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 text-2xl shadow-sm border border-primary-100/50">
              💳
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Informasi Pembayaran OKB</h3>
              <p className="text-sm text-gray-500 mt-0.5">Selesaikan pembayaran untuk memproses pendaftaran</p>
            </div>
          </div>
          
          <div className="mb-6 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
            <p className="text-gray-700">
              Mohon transfer biaya pendaftaran & OKB sebesar <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 font-bold rounded-lg border border-primary-100/50">{formattedFee}</span> ke rekening berikut:
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100/80">
              <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">Bank Tujuan</span>
              <span className="font-bold text-gray-900 flex items-center gap-2">
                🏦 {bankName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100/80">
              <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">No. Rekening</span>
              <span className="font-mono font-bold text-xl sm:text-2xl text-primary-600 tracking-wider bg-primary-50 px-4 py-1.5 rounded-lg border border-primary-100/50">
                {accountNumber}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">Atas Nama</span>
              <span className="font-bold text-gray-900">{accountHolder}</span>
            </div>
          </div>
          
          <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200/50 flex items-start gap-3">
            <span className="text-amber-500 text-xl shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-amber-800 leading-relaxed">
              Bapak/Ibu dapat mengabaikan informasi rekening di atas apabila sebelumnya <strong className="font-bold">sudah melakukan pembayaran</strong>. Cukup unggah bukti transfer/pembayarannya pada kolom yang tersedia di bawah.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {DOCUMENT_TYPES.map((doc) => {
          // Type safe string access for error message
          const errorMsg = (errors as any)[doc.key]?.message as string | undefined;
          
          return (
            <div key={doc.key} className="col-span-full">
              <FileUpload
                label={doc.label}
                name={doc.key}
                hint={doc.description}
                accept={doc.accept}
                error={errorMsg}
                value={watch(doc.key as any)}
                onChange={(file) => setValue(doc.key as any, file, { shouldValidate: true })}
                required
              />
            </div>
          );
        })}
      </div>



      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 rounded border-border text-primary-500 focus:ring-primary-500"
            {...register("pernyataanBenar")}
          />
          <span className="text-sm text-text-secondary">
            Dengan ini saya menyatakan bahwa seluruh data yang saya isikan pada formulir pendaftaran ini adalah BENAR dan sesuai dengan dokumen asli. Apabila di kemudian hari ditemukan ketidaksesuaian data, saya bersedia menerima konsekuensi pembatalan pendaftaran.
          </span>
        </label>
        {errors.pernyataanBenar && (
          <p className="text-danger-500 text-sm mt-2 ml-8">{errors.pernyataanBenar.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-10">
        <Button onClick={onPrev} variant="ghost" type="button" disabled={isSubmitting}>
          🡨 Kembali
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Kirim Pendaftaran"}
        </Button>
      </div>
      </div>
    </div>
  );
}
