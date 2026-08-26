'use client';

import { Play, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#F9FAFB] pt-28 pb-14 md:py-0">
      {/* Background Video & Ambient Glow */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 opacity-20 brightness-105 contrast-95"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-recording-a-cinematic-scene-with-a-professional-camera-40280-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft light overlays transitioning to white theme background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/75 to-[#F9FAFB]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#F9FAFB]/20 to-[#F9FAFB]" />
        
        {/* Ambient Brand Color Glow for Mobile to eliminate plain white emptiness */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-gradient-to-tr from-[#0033A0]/15 via-[#FDB913]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center flex flex-col items-center">
        {/* Studio Badge */}
        <div className="inline-flex items-center space-x-2 border border-[#0033A0]/25 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full mb-5 sm:mb-8 animate-fade-in shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0033A0] animate-ping" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.25em] text-[#0033A0] font-bold">
            Rencana Tuhan Studio
          </span>
        </div>

        {/* Large Prominent Mobile & Desktop Headline */}
        <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-[1.12] max-w-4xl animate-slide-up">
          Creating Stories <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0033A0] via-[#002D9C] to-[#FDB913] italic font-semibold">
            Through Visual
          </span>
        </h1>

        {/* Hero Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal tracking-wide max-w-md sm:max-w-2xl mb-8 sm:mb-12 leading-relaxed px-1 sm:px-2 animate-slide-up [animation-delay:200ms]">
          Kami meramu konsep, memproduksi visual, dan menyajikan karya sinematik kelas dunia untuk film, animasi, dan motion branding Anda.
        </p>

        {/* Responsive Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 w-full max-w-xs sm:max-w-none animate-slide-up [animation-delay:400ms]">
          <a
            href="#portfolio"
            className="group flex items-center justify-center space-x-3 w-full sm:w-auto bg-[#0033A0] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-2xl hover:bg-[#002D9C] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-300" />
            <span>LIHAT KARYA</span>
          </a>
          <a
            href="#calculator"
            className="group flex items-center justify-center space-x-3 w-full sm:w-auto bg-white text-slate-800 font-bold tracking-wider text-sm px-8 py-4 rounded-2xl border border-gray-300 hover:border-[#0033A0] hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 shadow-sm"
          >
            <span>START PROJECT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-[#FDB913]" />
          </a>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-20 sm:h-32 bg-gradient-to-t from-[#F9FAFB] to-transparent pointer-events-none" />
    </section>
  );
}
