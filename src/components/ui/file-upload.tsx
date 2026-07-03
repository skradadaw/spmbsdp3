"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_DISPLAY } from "@/lib/constants";

interface FileUploadProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  value?: File | null;
}

export function FileUpload({
  label,
  name,
  required,
  error,
  hint,
  accept = ALLOWED_MIME_TYPES.join(","),
  onChange,
  value,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatText = accept.includes("pdf") ? "PDF atau Gambar" : "Gambar";

  useEffect(() => {
    if (value && value.type.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const displayError = error || localError;

  const handleFile = (file: File) => {
    setLocalError(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setLocalError(`Ukuran file maksimal ${MAX_FILE_SIZE_DISPLAY}`);
      if (onChange) onChange(null);
      return;
    }

    // Pass up
    if (onChange) onChange(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = "";
    if (onChange) onChange(null);
    setLocalError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2">
        <label className={`form-label mb-0.5 ${required ? "form-label-required" : ""}`}>
          {label}
        </label>
        {hint && <p className="text-sm text-text-secondary">{hint}</p>}
      </div>

      {!value ? (
        <div
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-white transition-all cursor-pointer text-center ${
            isDragging ? "border-primary-500 bg-primary-50" : "border-border hover:border-primary-500 hover:bg-primary-50"
          } ${displayError ? "border-danger-500 bg-danger-50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            name={name}
            id={name}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            onChange={handleChange}
            required={required}
          />
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-2xl mb-3 transition-transform group-hover:-translate-y-1" aria-hidden="true">
            📁
          </div>
          <div className="text-base font-semibold text-text mb-1">
            Klik untuk Unggah atau Seret File
          </div>
          <div className="text-sm text-text-secondary">
            Format: {formatText} (Max. {MAX_FILE_SIZE_DISPLAY})
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-3 px-4 bg-white border border-border rounded-lg mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-xl">
                {value.type.includes("pdf") ? "📄" : "🖼️"}
              </span>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-text truncate max-w-[200px]">{value.name}</span>
                <span className="text-xs text-text-secondary">{formatFileSize(value.size)}</span>
              </div>
            </div>
            <button
              type="button"
              className="text-text-muted p-2 rounded-md transition-all hover:bg-danger-50 hover:text-danger-500"
              onClick={clearFile}
              aria-label="Hapus file"
            >
              ✕
            </button>
          </div>
          {previewUrl && (
            <div className="relative w-full h-32 md:h-40 rounded-md overflow-hidden bg-gray-50 border border-gray-100 mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}

      {displayError && <span className="form-error">{displayError}</span>}
    </div>
  );
}
