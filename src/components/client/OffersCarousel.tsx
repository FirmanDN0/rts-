'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (loading) {
    return (
      <section id="offers" className="py-12 sm:py-16 bg-gray-50 border-t border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 h-32 bg-gray-100 animate-pulse rounded-xl" />
      </section>
    );
  }

  if (offers.length === 0) return null;

  return (
    <section id="offers" className="py-16 sm:py-20 bg-gray-50 border-t border-b border-gray-200/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-[#0033A0]/5 via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-[#0033A0] mb-6">
          <Sparkles className="w-4 h-4 text-[#FDB913]" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold">
            Latest Offer / Update
          </span>
        </div>

        {/* Carousel Container with Touch Swipe support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative min-h-[260px] sm:min-h-[220px] md:min-h-[200px] flex items-center justify-center touch-pan-y"
        >
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`w-full max-w-3xl text-center flex flex-col items-center justify-center transition-all duration-500 absolute px-2 ${
                idx === currentIndex
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 translate-x-12 scale-95 pointer-events-none z-0 invisible'
              }`}
            >
              <h3 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 max-w-2xl leading-tight">
                {offer.title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed mb-6 sm:mb-8">
                {offer.description}
              </p>
              <a
                href="#calculator"
                className="group inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#0033A0] hover:text-[#002D9C] active:scale-95 transition-all"
              >
                <span>Ambil Penawaran</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 text-[#FDB913]" />
              </a>
            </div>
          ))}
        </div>

        {/* Navigation Arrows & Swipe Hint */}
        {offers.length > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-6 sm:mt-8 relative z-20">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-gray-200 bg-white text-slate-500 hover:text-slate-800 active:scale-95 transition-all shadow-sm"
              aria-label="Previous Offer"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex space-x-2 py-2">
              {offers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-[#0033A0]' : 'w-2 bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-gray-200 bg-white text-slate-500 hover:text-slate-800 active:scale-95 transition-all shadow-sm"
              aria-label="Next Offer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
