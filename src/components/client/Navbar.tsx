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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-white/85 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <img
              src="/logo.png"
              alt="Rencana Tuhan Studio"
              className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wider text-slate-600 hover:text-[#0033A0] transition-colors duration-300 relative py-1 group"
              >
                {link.name}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-[#0033A0] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col justify-center px-8 transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none invisible'
        }`}
      >
        <div className="flex flex-col space-y-6 text-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-3 text-2xl font-serif tracking-widest text-slate-700 hover:text-[#0033A0] transition-colors py-2"
            >
              <link.icon className="w-6 h-6 text-[#0033A0]/70" />
              <span>{link.name}</span>
            </a>
          ))}
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 text-sm uppercase tracking-widest text-slate-400 hover:text-[#0033A0] transition-all"
          >
            Portal Admin
          </Link>
        </div>
      </div>
    </>
  );
}
