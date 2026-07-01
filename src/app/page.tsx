'use client';

import { useState } from 'react';
import Navbar from '@/components/client/Navbar';
import Hero from '@/components/client/Hero';
import PortfolioGrid from '@/components/client/PortfolioGrid';
import OffersCarousel from '@/components/client/OffersCarousel';
import ServicesSection from '@/components/client/ServicesSection';
import PriceCalculator from '@/components/client/PriceCalculator';
import { Mail, Phone, MapPin, Film } from 'lucide-react';
import { DotGrid } from '@/components/client/Decorations';

export default function Home() {
  const [selectedService, setSelectedService] = useState('Film');

  return (
    <>
      {/* Premium Floating Navigation Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Cinematic Video Hero */}
        <Hero />

        {/* Selected Projects Gallery Showcase */}
        <PortfolioGrid />

        {/* Live Offers Sliding Carousel */}
        <OffersCarousel />

        {/* Services Cards */}
        <ServicesSection onSelectService={setSelectedService} />

        {/* Auto Price Estimation & Submission Portal */}
        <PriceCalculator
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
      </main>

      {/* Premium Dark Footer */}
      <footer className="bg-[#070A1E] border-t border-slate-900 pt-20 pb-10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-10" />
          <DotGrid className="absolute right-12 top-10 opacity-10 text-[#2F3A8F]" color="currentColor" />
          <DotGrid className="absolute left-12 bottom-10 opacity-10 text-[#F2B705]" color="currentColor" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Rencana Tuhan Studio"
                className="h-9 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed max-w-xs">
              Production house dan studio kreatif yang mengutamakan kedalaman visual, penceritaan emosional, dan standar kualitas sinematik terbaik.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Kategori</h4>
            <ul className="space-y-2 text-xs md:text-sm text-slate-400 font-light">
              <li><a href="#portfolio" className="hover:text-[#F2B705] transition-colors">Portfolio</a></li>
              <li><a href="#services" className="hover:text-[#F2B705] transition-colors">Layanan Studio</a></li>
              <li><a href="#offers" className="hover:text-[#F2B705] transition-colors">Update & Promo</a></li>
              <li><a href="#calculator" className="hover:text-[#F2B705] transition-colors">Estimasi Harga</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Kontak Kami</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#F2B705]/80" />
                <span>hello@rencanatuhan.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#F2B705]/80" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#F2B705]/80 mt-0.5" />
                <span className="leading-relaxed">Gedung Visual, Lantai 4. Raya Sukolilo No. 45, Surabaya</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">Ikuti Karya Kami</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-slate-900/60 border border-white/10 hover:border-[#F2B705] text-slate-400 hover:text-[#F2B705] transition-all duration-300 cursor-pointer"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-slate-900/60 border border-white/10 hover:border-[#F2B705] text-slate-400 hover:text-[#F2B705] transition-all duration-300 cursor-pointer"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                  <polygon points="10 15 15 12 10 9"/>
                </svg>
              </a>
              <a
                href="https://vimeo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded bg-slate-900/60 border border-white/10 hover:border-[#F2B705] text-slate-400 hover:text-[#F2B705] transition-all duration-300 cursor-pointer"
              >
                <Film size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 tracking-wider">
          <span>© 2026 Rencana Tuhan Studio (RTS). All Rights Reserved.</span>
          <div className="flex space-x-6">
            <a href="/admin" className="hover:text-[#F2B705] transition-colors">Portal Admin</a>
            <span>•</span>
            <a href="#" className="hover:text-[#F2B705] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#F2B705] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
