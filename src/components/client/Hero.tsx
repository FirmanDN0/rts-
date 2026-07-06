'use client';

import { Play, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#F9FAFB]">
      {/* Background Video */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/70 to-[#F9FAFB]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#F9FAFB]/20 to-[#F9FAFB]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 border border-[#0033A0]/30 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 animate-fade-in shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#0033A0] animate-ping" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#0033A0] font-bold">
            Rencana Tuhan Studio
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl font-semibold tracking-tight text-slate-800 mb-6 leading-tight max-w-4xl animate-slide-up">
          Creating Stories <br className="hidden md:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0033A0] via-[#0033A0]/90 to-[#FDB913] italic font-normal">
            Through Visual
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-600 font-light tracking-wide max-w-2xl mb-12 leading-relaxed animate-slide-up [animation-delay:200ms]">
          Kami meramu konsep, memproduksi visual, dan menyajikan karya sinematik kelas dunia untuk film, animasi, dan motion branding Anda.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto animate-slide-up [animation-delay:400ms]">
          <a
            href="#portfolio"
            className="group flex items-center justify-center space-x-3 w-full sm:w-auto bg-[#0033A0] text-white font-semibold tracking-wider text-sm px-8 py-4 rounded hover:bg-[#002D9C] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-300" />
            <span>LIHAT KARYA</span>
          </a>
          <a
            href="#calculator"
            className="group flex items-center justify-center space-x-3 w-full sm:w-auto bg-white text-slate-700 font-semibold tracking-wider text-sm px-8 py-4 rounded border border-gray-200 hover:border-[#0033A0] hover:bg-gray-50 transition-all duration-300 shadow-sm"
          >
            <span>START PROJECT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-[#FDB913]" />
          </a>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F9FAFB] to-transparent pointer-events-none" />
    </section>
  );
}
