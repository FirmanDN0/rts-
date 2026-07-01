'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Compass, CheckCircle2, Circle, AlertCircle, ArrowLeft, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

interface ProjectStatus {
  trackingCode: string;
  clientName: string;
  serviceType: string;
  duration: string;
  location: string;
  talent: boolean;
  equipment: boolean;
  specialRequest?: string;
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  negotiatedPrice?: number;
  status: string;
  createdAt: string;
}

export default function TrackingDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const unwrappedParams = use(params);
  const code = unwrappedParams.code;
  const [project, setProject] = useState<ProjectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/consultations/track/${code}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          const data = await res.json();
          setError(data.error || 'Project tidak ditemukan.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat status project.');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [code]);

  // Status mapping to index
  const statusStages = ['PENDING', 'REVIEW', 'NEGOTIATION', 'APPROVED', 'COMPLETED'];
  const stageDetails = [
    { label: 'Pending', desc: 'Permintaan terkirim & antri untuk direview.' },
    { label: 'Review RTS', desc: 'Tim kreatif RTS sedang meninjau kelayakan & jadwal.' },
    { label: 'Negotiation', desc: 'Estimasi disesuaikan. Siap didiskusikan via WA.' },
    { label: 'Approved', desc: 'Harga disepakati. DP diterima & masuk antrian produksi.' },
    { label: 'Completed', desc: 'Karya visual selesai & aset diserahkan ke client.' },
  ];

  const currentStageIndex = project ? statusStages.indexOf(project.status) : 0;

  const handleWhatsAppChat = () => {
    if (!project) return;
    const text = `Halo RTS, saya ingin berdiskusi mengenai status project saya.
Kode Tracking: ${project.trackingCode}
Status Saat Ini: ${project.status}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/6281234567890?text=${encodedText}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E26] text-white flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-[#F2B705] animate-spin mb-4" />
        <p className="text-slate-450 tracking-wider text-sm">Menghubungkan ke RTS database...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0B0E26] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Project Tidak Ditemukan</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-8">
          {error || 'Kode tracking tidak valid atau telah dihapus oleh administrator.'}
        </p>
        <div className="flex gap-4">
          <Link
            href="/tracking"
            className="bg-[#F2B705] text-[#0B0E26] font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-[#d8a304] transition-colors shadow-md"
          >
            CARI KODE LAIN
          </Link>
          <Link
            href="/"
            className="border border-white/10 text-slate-400 font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-white/5 transition-colors"
          >
            KEMBALI KE BERANDA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E26] text-white py-20 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-radial-gradient from-[#2F3A8F]/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      {/* Header Link */}
      <div className="max-w-5xl mx-auto mb-10">
        <Link
          href="/tracking"
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} className="text-[#F2B705]" />
          <span>CARI KODE LAIN</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Visual Status Timeline (2 cols span on lg) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card Wrapper */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-xl shadow-2xl space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F2B705] font-bold mb-2 block">
                TIMELINE STATUS PROJECT
              </span>
              <h2 className="font-serif text-3xl font-bold text-white tracking-wide">
                Progress Perkembangan
              </h2>
            </div>

            {/* Timeline Progress Line */}
            <div className="relative pl-8 space-y-8 before:absolute before:top-2 before:left-3.5 before:w-px before:h-[90%] before:bg-slate-800">
              {stageDetails.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;

                return (
                  <div key={stage.label} className="relative flex flex-col space-y-1">
                    {/* Bullet marker */}
                    <div className="absolute -left-[30px] top-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#F2B705] fill-[#0B0E26]" />
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#F2B705] bg-[#0B0E26] flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705] animate-ping" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705] absolute" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-700 bg-[#0B0E26]" />
                      )}
                    </div>

                    <h4
                      className={`text-sm uppercase tracking-wider font-bold ${
                        isActive
                          ? 'text-[#F2B705]'
                          : isCompleted
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    <p
                      className={`text-xs font-light leading-relaxed ${
                        isActive || isCompleted ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Project Details Panel */}
        <div className="space-y-6">
          
          {/* Status Box */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              KODE & STATUS
            </h4>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono font-bold text-white tracking-widest uppercase">
                {project.trackingCode}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-[#F2B705]/10 border border-[#F2B705]/20 text-[#F2B705] px-2.5 py-1 rounded">
                {project.status}
              </span>
            </div>

            {/* Price Box */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                {project.negotiatedPrice ? 'HARGA DISEPAKATI' : 'ESTIMASI ANGGARAN'}
              </span>
              {project.negotiatedPrice ? (
                <div className="text-2xl font-bold text-[#F2B705] flex items-center space-x-1">
                  <DollarSign className="w-5 h-5 text-[#F2B705]" />
                  <span>{formatIDR(project.negotiatedPrice)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-white">
                  {formatIDR(project.estimatedPriceMin)} — {formatIDR(project.estimatedPriceMax)}
                </span>
              )}
            </div>

            {/* Actions */}
            <button
              type="button"
              onClick={handleWhatsAppChat}
              className="w-full group flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs tracking-widest py-3 px-4 rounded transition-all duration-300 shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>NEGOSIASI / TANYA WA</span>
            </button>
          </div>

          {/* Configuration details */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-2xl space-y-4 text-xs font-light text-slate-300">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-white/10 pb-2">
              RINCIAN KONSULTASI
            </h4>
            <div className="flex justify-between">
              <span>Client:</span>
              <span className="text-white font-medium">{project.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span>Layanan:</span>
              <span className="text-white font-medium">{project.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span>Durasi:</span>
              <span className="text-white font-medium">{project.duration}</span>
            </div>
            <div className="flex justify-between">
              <span>Lokasi:</span>
              <span className="text-white font-medium">{project.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Talent/Aktor:</span>
              <span className="text-white font-medium">{project.talent ? 'Ya' : 'Tidak'}</span>
            </div>
            <div className="flex justify-between">
              <span>Gear Premium:</span>
              <span className="text-white font-medium">{project.equipment ? 'Ya' : 'Tidak'}</span>
            </div>
            
            {project.specialRequest && (
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Catatan Kebutuhan:
                </span>
                <p className="text-[11px] leading-relaxed italic bg-slate-950/60 border border-white/10 p-3 rounded text-slate-300">
                  "{project.specialRequest}"
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
