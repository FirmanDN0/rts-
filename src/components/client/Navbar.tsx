'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Monitor, Film, Calculator, Compass, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Karya', href: '#portfolio', icon: Film },
    { name: 'Layanan', href: '#services', icon: Compass },
    { name: 'Penawaran', href: '#offers', icon: Sparkles },
    { name: 'Estimasi Harga', href: '#calculator', icon: Calculator },
    { name: 'Track Project', href: '/tracking', icon: Monitor },
  ];

  return (
    <>
      <nav
        className={`fixed z-50 transition-all duration-500 left-1/2 -translate-x-1/2 ${
          isScrolled
            ? 'top-4 w-[92%] md:w-[95%] max-w-7xl py-3.5 bg-white/85 backdrop-blur-md border border-slate-200/60 rounded-full shadow-lg'
            : 'top-0 w-full py-6 bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <img
              src="/logo.png"
              alt="Rencana Tuhan Studio"
              className={`h-9 md:h-11 w-auto object-contain transition-all duration-300 group-hover:scale-[1.02] ${
                isScrolled ? '' : 'brightness-0 invert'
              }`}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold tracking-wider transition-all duration-300 relative py-1 group ${
                  isScrolled
                    ? 'text-slate-600 hover:text-[#2F3A8F]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                  isScrolled ? 'bg-[#2F3A8F]' : 'bg-[#F2B705]'
                }`} />
              </a>
            ))}
            <Link
              href="/admin"
              className={`text-[11px] uppercase tracking-widest px-3 py-1.5 rounded transition-all duration-300 border ${
                isScrolled
                  ? 'text-slate-500 border-gray-200 hover:text-[#2F3A8F] hover:border-[#2F3A8F]'
                  : 'text-white/60 border-white/20 hover:text-[#F2B705] hover:border-[#F2B705]'
              }`}
            >
              Portal Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors rounded focus:outline-none ${
              isScrolled
                ? 'text-slate-700 hover:text-[#2F3A8F]'
                : 'text-white hover:text-[#F2B705]'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#0B0E26] flex flex-col justify-center px-8 transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none invisible'
        }`}
      >
        <div className="flex flex-col space-y-6 text-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-3 text-2xl font-serif tracking-widest text-white/80 hover:text-[#F2B705] transition-colors py-2"
            >
              <link.icon className="w-6 h-6 text-[#F2B705]" />
              <span>{link.name}</span>
            </a>
          ))}
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 text-sm uppercase tracking-widest text-slate-400 hover:text-[#F2B705] transition-all"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </>
  );
}
