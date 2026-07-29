'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Gambar / Thumbnail',
  folder = 'general',
  required = false,
}: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate client-side size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file gambar maksimal 5MB');
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
        setSuccessMessage('Gambar berhasil diunggah!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(data.error || 'Gagal mengunggah gambar. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Upload component error:', err);
      setErrorMessage('Terjadi masalah jaringan saat mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold flex items-center space-x-1.5">
          <ImageIcon size={13} className="text-[#2F3A8F]" />
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>

        {/* Mode Toggle Switch */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded transition-all ${
              mode === 'upload'
                ? 'bg-[#2F3A8F] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`px-2 py-0.5 rounded transition-all ${
              mode === 'link'
                ? 'bg-[#2F3A8F] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Input Link URL
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload */}
      {mode === 'upload' && (
        <div>
          {value ? (
            <div className="relative group w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center shadow-xs">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
              />
              
              <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md rounded px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white hover:text-amber-300 text-[10px] font-semibold flex items-center space-x-1 transition-colors"
                >
                  <UploadCloud size={12} />
                  <span>Ganti File</span>
                </button>
                <span className="text-white/40">|</span>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="text-white hover:text-red-400 p-0.5 transition-colors"
                  title="Hapus gambar"
                >
                  <X size={14} />
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded max-w-[85%] truncate">
                {value.startsWith('data:') ? 'Inline Image (Base64)' : value}
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                uploading
                  ? 'bg-slate-50 border-slate-300 pointer-events-none'
                  : 'border-slate-300 hover:border-[#2F3A8F] hover:bg-[#2F3A8F]/5 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {uploading ? (
                <div className="flex flex-col items-center space-y-2 text-slate-600">
                  <RefreshCw className="w-7 h-7 animate-spin text-[#2F3A8F]" />
                  <p className="text-xs font-medium">Mengunggah gambar...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-[#2F3A8F]/10 text-[#2F3A8F] rounded-full">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Klik untuk memilih file <span className="font-normal text-slate-500">atau seret gambar ke sini</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Format: JPG, PNG, WEBP, GIF, SVG (Maks 5 MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Link URL Input */}
      {mode === 'link' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Masukkan link URL gambar (misal: https://... atau /uploads/...)"
              className="w-full glass-input pl-9 pr-4 py-2 text-xs font-mono text-slate-600"
            />
            <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

          {value ? (
            <div className="relative group w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center shadow-xs">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded px-2 py-1">
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="text-white hover:text-red-400 p-1 transition-colors"
                  title="Hapus link URL"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Status Messages */}
      {errorMessage && (
        <div className="flex items-center space-x-1.5 text-red-600 text-[11px] bg-red-50 border border-red-200 rounded p-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center space-x-1.5 text-emerald-700 text-[11px] bg-emerald-50 border border-emerald-200 rounded p-2">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}
