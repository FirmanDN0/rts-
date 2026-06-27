'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Search, ArrowLeft, AlertCircle } from 'lucide-react';

export default function TrackingSearchPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Silakan masukkan kode tracking Anda.');
      return;
    }

    // Basic format validation
    const trackingRegex = /^RTS-\d{4}-[A-Z0-9]{4}$/;
    if (!trackingRegex.test(trimmedCode)) {
      setError('Format kode tracking salah. Format yang benar: RTS-YYYY-XXXX (Contoh: RTS-2026-X84B).');
      return;
    }

    router.push(`/tracking/${trimmedCode}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center pt-24 pb-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-radial-gradient from-[#0033A0]/5 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Header Link */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} className="text-[#0033A0]" />
          <span>KEMBALI KE BERANDA</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="group flex items-center justify-center mb-8">
            <img
              src="/logo.png"
              alt="Rencana Tuhan Studio"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-800 mb-2">
            Track Project Status
          </h2>
          <p className="text-sm text-slate-500 font-light max-w-sm">
            Masukkan kode tracking konsultasi Anda untuk melihat update status dan penyesuaian harga secara real-time.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-scale-in">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-xl shadow-sm space-y-6">
          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                KODE TRACKING KONSULTASI
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="code"
                  id="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: RTS-2026-X84B"
                  className="w-full glass-input pl-4 pr-12 py-3 text-sm tracking-widest uppercase font-mono placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-300"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Compass className="h-5 w-5 text-slate-300" aria-hidden="true" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group flex items-center justify-center space-x-2 w-full bg-[#0033A0] text-white font-bold text-xs tracking-widest py-3.5 rounded hover:bg-[#002D9C] transition-all duration-300 shadow-sm"
            >
              <span>PERIKSA STATUS</span>
              <Search className="w-4 h-4 text-[#FDB913]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
