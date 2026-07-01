'use client';

import { Play, ArrowRight } from 'lucide-react';
import { DotGrid, ContourLines, OrganicBlob } from './Decorations';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-start overflow-hidden bg-[#0B0E26] text-white">
      {/* Background Video & Glowing Overlays */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 opacity-10 brightness-75 contrast-100"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-recording-a-cinematic-scene-with-a-professional-camera-40280-large.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Dark Blue Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1E5C] via-[#0B0E26] to-[#080B1E]" />
      </div>

      {/* Decorative Brand Patterns & Geometries matching mockup */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Large Yellow Arc on the Right */}
        <div className="absolute -right-32 md:-right-48 -top-10 w-[450px] h-[450px] md:w-[800px] md:h-[800px] rounded-full bg-[#F2B705] z-0" />
        
        {/* Overlapping Dark Navy Shape creating the organic curve */}
        <div className="absolute -right-32 md:-right-52 -bottom-20 w-[400px] h-[400px] md:w-[750px] md:h-[750px] rounded-full bg-[#0B0E26] z-10" />

        {/* Contour Lines inside the dark navy shape / bottom right */}
        <ContourLines className="opacity-20 z-20" color="rgba(255, 255, 255, 0.15)" />

        {/* Dot Grids on top left */}
        <DotGrid className="absolute left-8 md:left-16 top-32 opacity-35 z-20" color="white" />
        
        {/* Subtle Watermark RTS text */}
        <div className="absolute right-12 bottom-12 text-[100px] md:text-[180px] font-bold text-white/[0.02] tracking-wider select-none z-10 font-sans pointer-events-none">
          RTS
        </div>
      </div>

      {/* Hero Content Left-aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-left flex flex-col items-start justify-center">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#F2B705] font-bold mb-6 block animate-fade-in">
          RENCANA TUHAN STUDIO
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-[5.5rem] font-bold tracking-tight text-white mb-6 leading-[1.05] max-w-4xl animate-slide-up">
          We Create <br />
          Visual <span className="text-[#F2B705]">Stories</span> <br />
          That Inspire.
        </h1>

        <p className="text-sm md:text-base text-slate-300 font-light tracking-wide max-w-lg mb-10 leading-relaxed animate-slide-up [animation-delay:200ms]">
          Rencana Tuhan Studio hadir untuk membantu ide menjadi karya visual yang bermakna.
        </p>

        {/* Call to Action Button from mockup */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-slide-up [animation-delay:400ms]">
          <a
            href="#portfolio"
            className="group flex items-center justify-center bg-[#F2B705] text-[#0B0E26] font-bold tracking-wider text-xs px-8 py-4 rounded hover:bg-[#d69f04] transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <span>Lihat Portfolio</span>
          </a>
        </div>
      </div>

      {/* Decorative Bottom Fade to light body bg */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FCFDFE] to-transparent pointer-events-none z-0" />
    </section>
  );
}
