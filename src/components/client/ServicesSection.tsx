'use client';

import { useState, useEffect } from 'react';
import { Film, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { formatIDR } from '@/lib/calculator';
import { DotGrid, ContourLines, OrganicBlob } from './Decorations';

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
}

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const iconsMap: Record<string, any> = {
    'Film Production': Film,
    'Animation': Wand2,
    'Creative Visual': Sparkles,
  };

  const handleConsultClick = (name: string) => {
    // Map database service name to calculator option
    let calcName = name;
    if (name.includes('Film')) calcName = 'Film';
    else if (name.includes('Animation')) calcName = 'Animation';
    else if (name.includes('Visual') || name.includes('Motion')) calcName = 'Motion Graphic';

    onSelectService(calcName);

    // Smooth scroll to calculator
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-tr from-[#F3F5FA] via-[#FCFDFE] to-[#FAF7EE] relative overflow-hidden border-t border-slate-200/50">
      {/* Background decorations for Section Terang (Rich Light Style) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dot pattern base */}
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        
        {/* Soft Contour lines */}
        <ContourLines className="opacity-[0.08]" color="#2F3A8F" />

        {/* Modern Circle Overlaps matching Lingkaran Modern */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full border-2 border-[#2F3A8F]/10 pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-[400px] h-[400px] rounded-full border border-[#2F3A8F]/10 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-2 border-[#F2B705]/15 pointer-events-none" />

        {/* Brand Accent Glowing Blobs for warm lighting */}
        <OrganicBlob
          className="-left-32 top-1/4 w-[400px] h-[400px]"
          color1="#2F3A8F"
          color2="#2F3A8F"
          opacity={0.08}
          blur="blur(110px)"
        />
        <OrganicBlob
          className="-right-32 bottom-1/4 w-[400px] h-[400px]"
          color1="#F2B705"
          color2="#F2B705"
          opacity={0.09}
          blur="blur(100px)"
        />

        {/* Soft Wave Curves matching Geometri Lembut & Shape Dinamis */}
        {/* Bottom-left Blue Wave */}
        <svg className="absolute left-0 bottom-0 w-[200px] h-[100px] md:w-[350px] md:h-[180px] text-[#2F3A8F]/10 pointer-events-none" viewBox="0 0 350 180" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 180V60C80 80 140 40 200 90C260 140 300 120 350 150V180H0Z" />
        </svg>

        {/* Bottom-right Yellow Wave */}
        <svg className="absolute right-0 bottom-0 w-[150px] h-[75px] md:w-[280px] md:h-[140px] text-[#F2B705]/15 pointer-events-none" viewBox="0 0 280 140" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M280 140V50C230 65 185 40 140 75C95 110 50 85 0 120V140H280Z" />
        </svg>

        {/* Soft gold/yellow accent circle overlay */}
        <div className="absolute right-12 bottom-12 w-32 h-32 rounded-full bg-[#F2B705]/10 pointer-events-none animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-20 relative">
          <DotGrid className="mx-auto opacity-30 text-[#2F3A8F] mb-4" color="currentColor" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#2F3A8F] font-bold mb-3 block">
            OUR CORE EXPERTISE
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-slate-800 mb-6">
            Services & Specialties
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
            Menghadirkan keunggulan estetika dan ketepatan teknis dalam setiap detail pengerjaan visual.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[450px] bg-gray-100 animate-pulse rounded-lg border border-gray-200" />
            ))}
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = iconsMap[service.name] || Film;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#2F3A8F]/40 hover:-translate-y-1 transition-all duration-500 flex flex-col min-h-[480px]"
                >
                  {/* Photo Section */}
                  <div className="h-48 w-full overflow-hidden relative bg-slate-900">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-4 left-6 p-3 rounded-full bg-[#0B0E26] text-[#F2B705] border border-[#F2B705]/30 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white/80 backdrop-blur-sm">
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#2F3A8F] transition-colors duration-300">
                        {service.name}
                      </h3>
                      <p className="text-slate-500 text-xs md:text-sm font-light leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      {/* Price Tag */}
                      <div className="border-t border-slate-100 pt-4 mb-6">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                          Harga Mulai
                        </span>
                        <span className="text-lg font-bold text-[#2F3A8F] tracking-wide">
                          {formatIDR(service.basePrice)}
                        </span>
                      </div>

                      {/* Action CTA */}
                      <button
                        onClick={() => handleConsultClick(service.name)}
                        className="group flex items-center justify-between w-full bg-slate-50 border border-slate-200 hover:bg-[#2F3A8F] hover:border-[#2F3A8F] hover:text-white text-slate-700 font-bold tracking-wider text-xs px-5 py-3.5 rounded transition-all duration-300 cursor-pointer"
                      >
                        <span>KONSULTASI HARGA</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-[#F2B705]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
