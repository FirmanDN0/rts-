'use client';

import { useState, useEffect } from 'react';
import { Film, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

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
    <section id="services" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-[#0033A0] font-bold mb-2 sm:mb-3 block">
            OUR CORE EXPERTISE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-slate-800 mb-4 sm:mb-6">
            Services & Specialties
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed px-2">
            Menghadirkan keunggulan estetika dan ketepatan teknis dalam setiap detail pengerjaan visual.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[420px] sm:h-[450px] bg-gray-100 animate-pulse rounded-xl border border-gray-200" />
            ))}
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => {
              const IconComponent = iconsMap[service.name] || Film;
              return (
                <div
                  key={service.id}
                  className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#0033A0]/30 transition-all duration-300 flex flex-col min-h-[420px] sm:min-h-[480px]"
                >
                  {/* Photo Section */}
                  <div className="h-44 sm:h-48 w-full overflow-hidden relative bg-slate-900">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                    
                    {/* Floating Icon */}
                    <div className="absolute bottom-3.5 left-5 p-2.5 sm:p-3 rounded-full bg-white/90 backdrop-blur-md text-[#0033A0] border border-[#0033A0]/20 shadow-md">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-2 sm:mb-3">
                        {service.name}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      {/* Price Tag */}
                      <div className="border-t border-gray-100 pt-3.5 mb-5 sm:mb-6">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                          Harga Mulai
                        </span>
                        <span className="text-base sm:text-lg font-bold text-[#0033A0] tracking-wide">
                          {formatIDR(service.basePrice)}
                        </span>
                      </div>

                      {/* Action CTA */}
                      <button
                        onClick={() => handleConsultClick(service.name)}
                        className="group flex items-center justify-between w-full bg-gray-50 border border-gray-200 hover:bg-[#0033A0] hover:border-[#0033A0] hover:text-white text-slate-700 font-bold tracking-wider text-xs px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl active:scale-[0.98] transition-all duration-300"
                      >
                        <span>KONSULTASI HARGA</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-[#FDB913]" />
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
