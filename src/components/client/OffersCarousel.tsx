'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DotGrid, ContourLines, OrganicBlob } from './Decorations';

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function OffersCarousel() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  // Auto scroll offers
  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [offers]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  if (loading) {
    return (
      <section id="offers" className="py-16 bg-gray-50 border-t border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 h-36 bg-gray-100 animate-pulse rounded" />
      </section>
    );
  }

  if (offers.length === 0) return null;

  const [firstOffer] = offers; // Wait, we map them below

  return (
    <section id="offers" className="py-20 bg-gradient-to-br from-[#2F3A8F]/10 via-[#F3F5FA] to-[#F2B705]/10 border-t border-b border-slate-200/60 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <ContourLines className="opacity-[0.03]" color="#2F3A8F" />
        <OrganicBlob
          className="-right-24 top-1/2 w-[300px] h-[300px]"
          color1="#F2B705"
          opacity={0.05}
          blur="blur(80px)"
        />
        <OrganicBlob
          className="-left-24 top-1/4 w-[300px] h-[300px]"
          color1="#2F3A8F"
          opacity={0.04}
          blur="blur(80px)"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-[#2F3A8F] mb-6">
          <Sparkles className="w-4 h-4 text-[#F2B705]" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Latest Offer / Update</span>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[280px] sm:min-h-[240px] md:min-h-[200px] flex items-center justify-center">
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`w-full max-w-3xl text-center flex flex-col items-center justify-center transition-all duration-700 absolute ${
                idx === currentIndex
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 translate-x-12 scale-95 pointer-events-none z-0 invisible'
              }`}
            >
              <h3 className="font-serif text-2xl md:text-4xl font-bold text-slate-800 mb-4 max-w-2xl leading-tight">
                {offer.title}
              </h3>
              <p className="text-slate-500 text-sm md:text-base font-light max-w-xl leading-relaxed mb-8">
                {offer.description}
              </p>
              <a
                href="#calculator"
                className="group inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#2F3A8F] hover:text-[#1E255C] transition-colors duration-300"
              >
                <span>Ambil Penawaran</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 text-[#F2B705]" />
              </a>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {offers.length > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8 relative z-20">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
              aria-label="Previous Offer"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex space-x-1.5">
              {offers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-4 bg-[#2F3A8F]' : 'bg-slate-200'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
              aria-label="Next Offer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
