'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Success: Redirect to dashboard
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Username atau password salah.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center pt-24 pb-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-radial-gradient from-[#0033A0]/5 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Back to Home Link */}
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
            Portal Administrator
          </h2>
          <p className="text-sm text-slate-500 font-light max-w-sm">
            Masuk untuk mengelola portfolio, layanan, penawaran, dan meninjau konsultasi client.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-scale-in">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-xl shadow-sm space-y-6 bg-white">
          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-600 flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                USERNAME
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full glass-input pl-10 pr-4 py-3 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-350" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                PASSWORD
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-10 pr-4 py-3 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-350" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center space-x-2 w-full bg-[#0033A0] text-white font-bold text-xs tracking-widest py-3.5 rounded hover:bg-[#002D9C] transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>MASUK...</span>
                </>
              ) : (
                <span>MASUK KE DASHBOARD</span>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
