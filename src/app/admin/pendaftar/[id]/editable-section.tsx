"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePendaftarData } from "../actions";
import { PencilSimple, FloppyDisk, X } from "@phosphor-icons/react";

type FieldConfig = {
  label: string;
  dbKey: string;
  value: string;
  displayValue?: string; // Formatted label for view mode
  className?: string;
  type?: "text" | "select" | "textarea" | "date" | "number" | "tel";
  options?: { value: string; label: string }[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
};

export function EditableSection({
  pendaftarId,
  title,
  accentColor = "var(--color-primary-600)",
  fields,
}: {
  pendaftarId: string;
  title: string;
  accentColor?: string;
  fields: FieldConfig[];
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const startEditing = () => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => {
      initial[f.dbKey] = f.value || "";
    });
    setEditValues(initial);
    setIsEditing(true);
    setMessage(null);
    setErrors({});
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValues({});
    setMessage(null);
    setErrors({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    setErrors({});

    let hasError = false;
    const newErrors: Record<string, string> = {};
    const changed: Record<string, string> = {};

    fields.forEach((f) => {
      let val = editValues[f.dbKey] || "";
      if (f.type === "textarea") {
        val = val.replace(/[\r\n]+/g, " ").trim();
      } else {
        val = val.trim();
      }

      // Validation
      if (f.required && !val) {
        newErrors[f.dbKey] = "Wajib diisi.";
        hasError = true;
      } else if (val && f.minLength && val.length < f.minLength) {
        newErrors[f.dbKey] = `Minimal ${f.minLength} karakter.`;
        hasError = true;
      } else if (val && f.maxLength && val.length > f.maxLength) {
        newErrors[f.dbKey] = `Maksimal ${f.maxLength} karakter.`;
        hasError = true;
      }

      if (val !== (f.value || "")) {
        changed[f.dbKey] = val;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      setIsSaving(false);
      setMessage({ text: "Terdapat kesalahan pada input. Mohon periksa kembali.", type: "error" });
      return;
    }

    if (Object.keys(changed).length === 0) {
      setIsEditing(false);
      setIsSaving(false);
      return;
    }

    const res = await updatePendaftarData(pendaftarId, changed);
    setIsSaving(false);

    if (res.error) {
      setMessage({ text: res.error, type: "error" });
    } else {
      setMessage({ text: "Data berhasil disimpan.", type: "success" });
      setIsEditing(false);
      router.refresh();
    }
  };

  const updateField = (key: string, val: string) => {
    setEditValues((prev) => ({ ...prev, [key]: val }));
    // Clear error when user types
    if (errors[key]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[key];
        return newErrs;
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border-light)]">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
          <h2 className="text-xl font-bold text-[var(--color-primary-900)] m-0">{title}</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-600)] bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] border border-[var(--color-primary-200)] rounded-lg transition-colors uppercase tracking-wider"
          >
            <PencilSimple size={14} weight="bold" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEditing}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] hover:bg-gray-200 border border-[var(--color-border)] rounded-lg transition-colors uppercase tracking-wider disabled:opacity-50"
            >
              <X size={14} weight="bold" />
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] border border-[var(--color-primary-700)] rounded-lg transition-colors uppercase tracking-wider disabled:opacity-50"
            >
              <FloppyDisk size={14} weight="bold" />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-semibold ${message.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
          }`}>
          {message.text}
        </div>
      )}

      {/* Fields Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-4 gap-x-4">
        {fields.map((field) => (
          <div
            key={field.dbKey}
            className={`flex flex-col gap-1 pb-3 border-b border-dashed border-[var(--color-border-light)] ${field.className || ""}`}
          >
            <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1">
              {field.label}
              {field.required && isEditing && <span className="text-red-500">*</span>}
            </span>

            {isEditing ? (
              field.type === "select" && field.options ? (
                <select
                  value={editValues[field.dbKey] || ""}
                  onChange={(e) => updateField(field.dbKey, e.target.value)}
                  className={`text-[14px] font-bold text-[var(--color-text)] leading-snug px-2.5 py-1.5 border bg-white rounded-lg outline-none focus:ring-2 transition-all ${
                    errors[field.dbKey]
                      ? "border-red-500 focus:ring-red-200 focus:border-red-600"
                      : "border-[var(--color-primary-300)] focus:ring-[var(--color-primary-200)] focus:border-[var(--color-primary-500)]"
                  }`}
                >
                  <option value="" disabled>Pilih {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={editValues[field.dbKey] || ""}
                  onChange={(e) => updateField(field.dbKey, e.target.value)}
                  rows={2}
                  className={`text-[14px] font-bold text-[var(--color-text)] leading-snug px-2.5 py-1.5 border bg-white rounded-lg outline-none focus:ring-2 transition-all resize-y font-sans ${
                    errors[field.dbKey]
                      ? "border-red-500 focus:ring-red-200 focus:border-red-600"
                      : "border-[var(--color-primary-300)] focus:ring-[var(--color-primary-200)] focus:border-[var(--color-primary-500)]"
                  }`}
                />
              ) : (
                <input
                  type={field.type === "date" ? "date" : field.type === "number" || field.type === "tel" ? "text" : "text"}
                  inputMode={field.type === "number" || field.type === "tel" ? "numeric" : undefined}
                  value={editValues[field.dbKey] || ""}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (field.type === "number" || field.type === "tel") {
                      val = val.replace(/[^0-9]/g, ""); // Remove non-digits
                    }
                    updateField(field.dbKey, val);
                  }}
                  className={`text-[14px] font-bold text-[var(--color-text)] leading-snug px-2.5 py-1.5 border bg-white rounded-lg outline-none focus:ring-2 transition-all ${
                    errors[field.dbKey]
                      ? "border-red-500 focus:ring-red-200 focus:border-red-600"
                      : "border-[var(--color-primary-300)] focus:ring-[var(--color-primary-200)] focus:border-[var(--color-primary-500)]"
                  }`}
                />
              )
            ) : (
              <span className="text-[14px] font-bold text-[var(--color-text)] leading-snug break-words">
                {field.displayValue || field.value || "-"}
              </span>
            )}
            
            {/* Error Message */}
            {isEditing && errors[field.dbKey] && (
              <span className="text-[11px] font-semibold text-red-500 mt-0.5 animate-in fade-in slide-in-from-top-1">
                {errors[field.dbKey]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
