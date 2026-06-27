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
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <Compass className="w-12 h-12 text-[#0033A0] animate-spin mb-4" />
        <p className="text-slate-500 tracking-wider text-sm">Menghubungkan ke RTS database...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-800 mb-2">Project Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-8">
          {error || 'Kode tracking tidak valid atau telah dihapus oleh administrator.'}
        </p>
        <div className="flex gap-4">
          <Link
            href="/tracking"
            className="bg-[#0033A0] text-white font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-[#002D9C] transition-colors shadow-sm"
          >
            CARI KODE LAIN
          </Link>
          <Link
            href="/"
            className="border border-gray-200 text-slate-600 font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-gray-50 transition-colors"
          >
            KEMBALI KE BERANDA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-20 px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-radial-gradient from-[#0033A0]/5 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Header Link */}
      <div className="max-w-5xl mx-auto mb-10">
        <Link
          href="/tracking"
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} className="text-[#0033A0]" />
          <span>CARI KODE LAIN</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Visual Status Timeline (2 cols span on lg) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card Wrapper */}
          <div className="glass-panel p-8 md:p-10 rounded-xl shadow-sm space-y-8 bg-white">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#0033A0] font-bold mb-2 block">
                TIMELINE STATUS PROJECT
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-800 tracking-wide">
                Progress Perkembangan
              </h2>
            </div>

            {/* Timeline Progress Line */}
            <div className="relative pl-8 space-y-8 before:absolute before:top-2 before:left-3.5 before:w-px before:h-[90%] before:bg-gray-200">
              {stageDetails.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;

                return (
                  <div key={stage.label} className="relative flex flex-col space-y-1">
                    {/* Bullet marker */}
                    <div className="absolute -left-[30px] top-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#0033A0] fill-white" />
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#0033A0] bg-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0033A0] animate-ping" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0033A0] absolute" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 bg-white" />
                      )}
                    </div>

                    <h4
                      className={`text-sm uppercase tracking-wider font-bold ${
                        isActive
                          ? 'text-[#0033A0]'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    <p
                      className={`text-xs font-light leading-relaxed ${
                        isActive || isCompleted ? 'text-slate-600' : 'text-slate-400'
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
          <div className="glass-panel p-6 rounded-xl shadow-sm space-y-4 bg-white">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              KODE & STATUS
            </h4>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-mono font-bold text-slate-800 tracking-widest uppercase">
                {project.trackingCode}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-[#0033A0]/10 border border-[#0033A0]/20 text-[#0033A0] px-2.5 py-1 rounded">
                {project.status}
              </span>
            </div>

            {/* Price Box */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                {project.negotiatedPrice ? 'HARGA DISEPAKATI' : 'ESTIMASI ANGGARAN'}
              </span>
              {project.negotiatedPrice ? (
                <div className="text-2xl font-bold text-[#0033A0] flex items-center space-x-1">
                  <DollarSign className="w-5 h-5 text-[#FDB913]" />
                  <span>{formatIDR(project.negotiatedPrice)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-slate-800">
                  {formatIDR(project.estimatedPriceMin)} — {formatIDR(project.estimatedPriceMax)}
                </span>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={handleWhatsAppChat}
              className="w-full group flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs tracking-widest py-3 px-4 rounded transition-all duration-300 shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>NEGOSIASI / TANYA WA</span>
            </button>
          </div>

          {/* Configuration details */}
          <div className="glass-panel p-6 rounded-xl shadow-sm space-y-4 text-xs font-light text-slate-600 bg-white">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-gray-150 pb-2">
              RINCIAN KONSULTASI
            </h4>
            <div className="flex justify-between">
              <span>Client:</span>
              <span className="text-slate-800 font-medium">{project.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span>Layanan:</span>
              <span className="text-slate-800 font-medium">{project.serviceType}</span>
            </div>
            <div className="flex justify-between">
              <span>Durasi:</span>
              <span className="text-slate-800 font-medium">{project.duration}</span>
            </div>
            <div className="flex justify-between">
              <span>Lokasi:</span>
              <span className="text-slate-800 font-medium">{project.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Talent/Aktor:</span>
              <span className="text-slate-800 font-medium">{project.talent ? 'Ya' : 'Tidak'}</span>
            </div>
            <div className="flex justify-between">
              <span>Gear Premium:</span>
              <span className="text-slate-800 font-medium">{project.equipment ? 'Ya' : 'Tidak'}</span>
            </div>
            
            {project.specialRequest && (
              <div className="pt-2 border-t border-gray-150 space-y-1">
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Catatan Kebutuhan:
                </span>
                <p className="text-[11px] leading-relaxed italic bg-gray-50 border border-gray-150 p-2 rounded text-slate-600">
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
