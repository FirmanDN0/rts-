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
    <div className="min-h-screen bg-[#0B0E26] text-white flex flex-col justify-center pt-24 pb-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2F3A8F]/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      {/* Header Link */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} className="text-[#F2B705]" />
          <span>KEMBALI KE BERANDA</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="group flex items-center justify-center mb-8">
            <img
              src="/logo.png"
              alt="Rencana Tuhan Studio"
              className="h-10 w-auto object-contain brightness-110"
            />
          </Link>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
            Track Project Status
          </h2>
          <p className="text-sm text-slate-450 font-light max-w-sm">
            Masukkan kode tracking konsultasi Anda untuk melihat update status dan penyesuaian harga secara real-time.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-scale-in">
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 py-8 px-6 sm:px-10 rounded-xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded bg-red-950/40 border border-red-500/30 text-red-400 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="text-[10px] uppercase tracking-widest text-slate-350 font-semibold">
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
                  className="w-full bg-slate-950/60 border border-white/10 text-white pl-4 pr-12 py-3 text-sm tracking-widest uppercase font-mono placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-500 rounded-lg focus:ring-1 focus:ring-[#F2B705] focus:border-[#F2B705]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Compass className="h-5 w-5 text-slate-500" aria-hidden="true" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group flex items-center justify-center space-x-2 w-full bg-[#F2B705] text-[#0B0E26] font-bold text-xs tracking-widest py-3.5 rounded hover:bg-[#d8a304] transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>PERIKSA STATUS</span>
              <Search className="w-4 h-4 text-[#0B0E26]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
