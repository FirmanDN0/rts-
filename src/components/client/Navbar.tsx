'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Monitor,
  Film,
  Calculator,
  Compass,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Shield,
  ShoppingBag,
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    {
      name: 'Katalog Paket',
      subtitle: 'Paket produksi & deliverables lengkap',
      href: '#catalog',
      icon: ShoppingBag,
      badge: 'New',
    },
    {
      name: 'Portfolio Karya',
      subtitle: 'Galeri film & visual sinematik',
      href: '#portfolio',
      icon: Film,
      badge: 'Selected',
    },
    {
      name: 'Layanan Studio',
      subtitle: 'Production, Animation & Visual',
      href: '#services',
      icon: Compass,
    },
    {
      name: 'Penawaran & Promo',
      subtitle: 'Update paket & diskon spesial',
      href: '#offers',
      icon: Sparkles,
      badge: 'Hot',
    },
    {
      name: 'Estimasi Harga',
      subtitle: 'Kalkulator AI Smart Pricing Engine',
      href: '#calculator',
      icon: Calculator,
    },
    {
      name: 'Track Project',
      subtitle: 'Pantau status negosiasi real-time',
      href: '/tracking',
      icon: Monitor,
    },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 md:py-4 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
            : 'py-4 md:py-6 bg-gradient-to-b from-white/90 via-white/50 to-transparent backdrop-blur-[2px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <img
              src="/logo.png"
              alt="Rencana Tuhan Studio"
              className="h-8 sm:h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs sm:text-sm font-medium tracking-wider text-slate-600 hover:text-[#0033A0] transition-colors duration-300 relative py-1 group flex items-center space-x-1.5"
              >
                <span>{link.name.replace('Portfolio ', '').replace('& Promo', '')}</span>
                {link.badge === 'New' && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#0033A0] text-white">
                    New
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#0033A0] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link
              href="/admin"
              className="text-[11px] uppercase tracking-widest text-slate-400 hover:text-[#0033A0] hover:border-[#0033A0] border border-gray-200 px-3 py-1.5 rounded transition-all duration-300"
            >
              Portal Admin
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full text-slate-700 hover:text-[#0033A0] bg-white/90 border border-gray-200 shadow-sm active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Redesigned Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {/* Drawer Content Card Container */}
        <div
          className={`fixed inset-x-0 top-0 max-h-[100dvh] bg-white flex flex-col justify-between rounded-b-3xl shadow-2xl transition-transform duration-300 ease-out overflow-hidden border-b border-gray-200/80 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3.5 border-b border-gray-100 bg-white/80 backdrop-blur-md shrink-0">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Rencana Tuhan Studio"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#0033A0]/10 text-[#0033A0]">
                NAV MENU
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 bg-gray-100 active:scale-95 transition-all"
                aria-label="Tutup menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
            {/* Nav Link Cards */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 hover:bg-[#0033A0]/5 border border-slate-100 hover:border-[#0033A0]/20 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white text-[#0033A0] shadow-sm border border-gray-150/60 shrink-0 group-hover:scale-105 transition-transform">
                      <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-[#0033A0] transition-colors truncate">
                          {link.name}
                        </span>
                        {link.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              link.badge === 'Hot'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-[#0033A0]/10 text-[#0033A0]'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-light truncate mt-0.5">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0033A0] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {/* Smart Pricing Engine CTA Card Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0033A0] via-[#002880] to-[#1E255C] text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#FDB913] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>RTS Smart Pricing</span>
                </div>
                <h4 className="font-serif text-base font-bold leading-snug">
                  Hitung Estimasi Biaya Project Sinematik Anda
                </h4>
                <p className="text-slate-200 text-xs font-light leading-relaxed">
                  Gunakan form interaktif atau AI Pricing Engine untuk hasil perhitungan transparan & instan.
                </p>
                <a
                  href="/#calculator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center space-x-2 w-full bg-[#FDB913] hover:bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow active:scale-98 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-900" />
                  <span>Cek Estimasi Harga Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Drawer Bottom Footer */}
          <div className="px-5 py-3.5 border-t border-gray-100 bg-slate-50/80 shrink-0 flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-[11px] text-slate-500">© 2026 Rencana Tuhan Studio</span>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-slate-500 hover:text-[#0033A0] transition-colors py-1 px-2 rounded-lg hover:bg-gray-200/50"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Portal Admin →</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
