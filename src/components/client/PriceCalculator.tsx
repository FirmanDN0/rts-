'use client';

import { useState, useEffect } from 'react';
import {
  Calculator,
  ArrowRight,
  MessageSquare,
  Clipboard,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Bot,
  Layers,
  Settings,
  Users,
  MapPin,
  Clock,
  Coins,
  Video,
  FileText
} from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

interface PriceCalculatorProps {
  selectedService: string;
  setSelectedService: (serviceName: string) => void;
}

interface EquipmentOption {
  id: string;
  name: string;
  category: string;
  pricePerHour: number;
}

interface LaborOption {
  id: string;
  role: string;
}

interface ScoreOption {
  id: string;
  parameter: string;
  optionLabel: string;
  score: number;
}

interface AssetOption {
  id: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
}

export default function PriceCalculator({ selectedService, setSelectedService }: PriceCalculatorProps) {
  // Navigation & UI tabs
  const [activeTab, setActiveTab] = useState<'form' | 'ai'>('form');
  const [formCategory, setFormCategory] = useState<'CP' | 'CA'>('CP');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Master Data from DB
  const [masterData, setMasterData] = useState<{
    equipment: EquipmentOption[];
    labor: LaborOption[];
    scoreOptions: ScoreOption[];
    assetPrices: AssetOption[];
  }>({
    equipment: [],
    labor: [],
    scoreOptions: [],
    assetPrices: [],
  });

  // Form states - CP (Creative Production)
  const [serviceRole, setServiceRole] = useState<'Videographer' | 'Photographer' | 'Editor'>('Videographer');
  const [productionType, setProductionType] = useState('Company Profile');
  const [durationHours, setDurationHours] = useState(8);
  const [location, setLocation] = useState('Sidoarjo');
  const [packageType, setPackageType] = useState<'Basic' | 'Professional' | 'Custom'>('Basic');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedLabor, setSelectedLabor] = useState<string[]>([]);
  const [selectedScoreOptions, setSelectedScoreOptions] = useState<{ [key: string]: string }>({});

  // Form states - CA (Content Asset)
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assetQuantity, setAssetQuantity] = useState(5);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');

  // Contact States
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // Result States
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [calculationBreakdown, setCalculationBreakdown] = useState<any>(null);
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);

  // Fetch Master Data for UI Rendering
  useEffect(() => {
    async function loadPricingOptions() {
      try {
        const res = await fetch('/api/pricing/master');
        if (res.ok) {
          const data = await res.json();
          setMasterData(data);
          
          // Set default selected asset if available
          if (data.assetPrices && data.assetPrices.length > 0) {
            setSelectedAsset(data.assetPrices[0].name);
          }
          
          // Set default score options (choose first option for each parameter)
          const defaults: { [key: string]: string } = {};
          const parameters = Array.from(new Set(data.scoreOptions.map((o: any) => o.parameter))) as string[];
          parameters.forEach(p => {
            const match = data.scoreOptions.find((o: any) => o.parameter === p);
            if (match) defaults[p] = match.id;
          });
          setSelectedScoreOptions(defaults);
        }
      } catch (err) {
        console.error('Error loading pricing options:', err);
      }
    }
    loadPricingOptions();
  }, []);

  // Sync selected service type from parent component
  useEffect(() => {
    if (selectedService) {
      if (selectedService === 'Animation' || selectedService === 'Motion Graphic') {
        setFormCategory('CP');
        setServiceRole('Editor');
        setProductionType('Animation');
      } else if (selectedService === 'Film Production') {
        setFormCategory('CP');
        setServiceRole('Videographer');
        setProductionType('Company Profile');
      } else if (selectedService === 'Creative Visual') {
        setFormCategory('CA');
      }
    }
  }, [selectedService]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'ai' && !aiPrompt.trim()) {
      setError('Harap masukkan deskripsi kebutuhan project Anda.');
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientWhatsapp) {
      setError('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    let payload: any = {
      clientName,
      clientWhatsapp,
      clientEmail,
      specialRequest,
    };

    if (activeTab === 'ai') {
      payload.aiPrompt = aiPrompt;
    } else if (formCategory === 'CP') {
      payload.consultationType = 'CP';
      payload.serviceRole = serviceRole;
      payload.productionType = productionType;
      payload.packageType = packageType;
      payload.customEquipmentNames = selectedEquipment;
      payload.durationHours = durationHours;
      payload.selectedOptionIds = Object.values(selectedScoreOptions);
      payload.laborRoles = selectedLabor;
      payload.location = location;
    } else {
      payload.consultationType = 'CA';
      payload.assetName = selectedAsset;
      payload.quantity = assetQuantity;
    }

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMinPrice(data.consultation.estimatedPriceMin);
        setMaxPrice(data.consultation.estimatedPriceMax);
        setTrackingCode(data.trackingCode);
        
        if (data.consultation.calculationJson) {
          const parsed = JSON.parse(data.consultation.calculationJson);
          setCalculationBreakdown(parsed);
        }
        if (data.aiAnalysis) {
          setAiAnalysisText(data.aiAnalysis.explanation);
        }
        
        setStep(3);
      } else {
        setError(data.error || 'Terjadi kesalahan saat memproses estimasi.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!trackingCode) return;
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    if (!trackingCode || minPrice === null || maxPrice === null) return;

    const formattedMin = formatIDR(minPrice);
    const formattedMax = formatIDR(maxPrice);
    
    let details = '';
    if (activeTab === 'ai') {
      details = `Brief AI: "${aiPrompt.substring(0, 100)}${aiPrompt.length > 100 ? '...' : ''}"`;
    } else if (formCategory === 'CP') {
      details = `Layanan CP: ${serviceRole} (${productionType})\n` +
                `- Durasi: ${durationHours} jam\n` +
                `- Lokasi: ${location}\n` +
                `- Paket Alat: ${packageType}\n` +
                `- Tambahan Crew: ${selectedLabor.join(', ') || 'Tidak ada'}\n` +
                `- Kategori Proyek: ${calculationBreakdown?.category || 'Menyesuaikan'}`;
    } else {
      details = `Layanan CA:\n` +
                `- Asset: ${selectedAsset}\n` +
                `- Jumlah: ${assetQuantity} pcs`;
    }

    const text = `Halo RTS, saya ingin konsultasi project.
    
Detail Estimasi:
${details}

Estimasi Harga: ${formattedMin} - ${formattedMax}
Kode Track: ${trackingCode}

Mohon bantuannya untuk diskusi kelanjutan project ini. Terima kasih!`;

    const encodedText = encodeURIComponent(text);
    const whatsappNumber = '6281234567890'; // RTS Official WA number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
  };

  const handleReset = () => {
    setStep(1);
    setMinPrice(null);
    setMaxPrice(null);
    setTrackingCode(null);
    setCalculationBreakdown(null);
    setAiAnalysisText(null);
    setAiPrompt('');
    setSelectedEquipment([]);
    setSelectedLabor([]);
    setSpecialRequest('');
    setAssetQuantity(5);
  };

  // Group score options by parameter name
  const scoreParameters = Array.from(new Set(masterData.scoreOptions.map(o => o.parameter))) as string[];

  return (
    <section id="calculator" className="py-24 bg-gray-50 border-t border-gray-200/50 relative">
      <div className="absolute inset-0 bg-radial-gradient from-[#2F3A8F]/5 via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-[#2F3A8F] mb-3">
            <Calculator className="w-4 h-4 text-[#F2B705]" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold">RTS SMART PRICING SYSTEM</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-slate-800 mb-4">
            Kalkulator & AI Estimator Harga
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
            Pilih form interaktif kami atau masukkan deskripsi project Anda untuk dihitung secara instan menggunakan AI Pricing Engine.
          </p>
        </div>

        {/* Tab Selection */}
        {step === 1 && (
          <div className="flex justify-center mb-10">
            <div className="bg-gray-150 p-1 rounded-lg flex items-center space-x-1 border border-gray-200">
              <button
                type="button"
                onClick={() => { setActiveTab('form'); setError(null); }}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-md text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeTab === 'form'
                    ? 'bg-white text-[#2F3A8F] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Form Interaktif</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('ai'); setError(null); }}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-md text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeTab === 'ai'
                    ? 'bg-white text-[#2F3A8F] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-[#F2B705]" />
                <span>AI Pricing Engine</span>
              </button>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-10 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <span className={step >= 1 ? 'text-[#2F3A8F] font-bold' : ''}>1. Detail Kebutuhan</span>
          <span className="w-8 h-px bg-gray-200" />
          <span className={step >= 2 ? 'text-[#2F3A8F] font-bold' : ''}>2. Kontak Client</span>
          <span className="w-8 h-px bg-gray-200" />
          <span className={step >= 3 ? 'text-[#2F3A8F] font-bold' : ''}>3. Hasil Estimasi</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-600 flex items-center space-x-3 text-sm max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: FORM-BASED CALCULATOR */}
        {step === 1 && activeTab === 'form' && (
          <form onSubmit={handleNextStep} className="glass-panel p-8 md:p-12 rounded-xl shadow-sm space-y-10 animate-scale-in">
            {/* Category Select: CP vs CA */}
            <div className="border-b border-gray-200/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-sm uppercase tracking-wider text-slate-700 font-bold">Kategori Layanan</h4>
                <p className="text-slate-400 text-xs font-light">Pilih jenis pengerjaan visual yang Anda butuhkan.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormCategory('CP')}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-lg border transition-all ${
                    formCategory === 'CP'
                      ? 'border-[#2F3A8F] bg-[#2F3A8F]/5 text-[#2F3A8F]'
                      : 'border-gray-200 text-slate-500 hover:bg-gray-50'
                  }`}
                >
                  Creative Production (CP)
                </button>
                <button
                  type="button"
                  onClick={() => setFormCategory('CA')}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-lg border transition-all ${
                    formCategory === 'CA'
                      ? 'border-[#2F3A8F] bg-[#2F3A8F]/5 text-[#2F3A8F]'
                      : 'border-gray-200 text-slate-500 hover:bg-gray-50'
                  }`}
                >
                  Content Asset (CA)
                </button>
              </div>
            </div>

            {/* A. Creative Production (CP) Form */}
            {formCategory === 'CP' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Service Role selection */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center space-x-2">
                      <Video className="w-3.5 h-3.5 text-[#2F3A8F]" />
                      <span>Pilih Peran Utama</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Videographer', 'Photographer', 'Editor'] as const).map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setServiceRole(role)}
                          className={`py-3 text-xs uppercase tracking-wider font-bold rounded border transition-all duration-300 ${
                            serviceRole === role
                              ? 'border-[#2F3A8F] bg-[#2F3A8F]/5 text-[#2F3A8F]'
                              : 'border-gray-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800'
                          }`}
                        >
                          {role === 'Videographer' ? 'Video' : role === 'Photographer' ? 'Photo' : 'Editor'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Production Type */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Jenis Produksi
                    </label>
                    <select
                      value={productionType}
                      onChange={(e) => setProductionType(e.target.value)}
                      className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F]"
                    >
                      <option value="Company Profile">Company Profile</option>
                      <option value="Commercial Video">Commercial Video</option>
                      <option value="Social Media Content">Social Media Content</option>
                      <option value="Dokumentasi Event">Dokumentasi Event</option>
                      <option value="Film">Film</option>
                      <option value="Project lainnya">Project lainnya</option>
                    </select>
                  </div>

                  {/* Location & Duration (skipped for Editor) */}
                  {serviceRole !== 'Editor' && (
                    <>
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-[#2F3A8F]" />
                          <span>Lokasi & Akomodasi</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Sidoarjo', 'Luar Sidoarjo'].map(loc => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => setLocation(loc)}
                              className={`py-3 text-xs uppercase tracking-wider font-bold rounded border transition-all duration-300 ${
                                location === loc
                                  ? 'border-[#2F3A8F] bg-[#2F3A8F]/5 text-[#2F3A8F]'
                                  : 'border-gray-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800'
                              }`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-[#2F3A8F]" />
                          <span>Durasi Shooting (Jam): {durationHours} Jam</span>
                        </label>
                        <input
                          type="range"
                          min={2}
                          max={48}
                          step={1}
                          value={durationHours}
                          onChange={(e) => setDurationHours(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2F3A8F]"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Digunakan untuk menghitung BEP pemakaian peralatan per jam.
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Equipment Packages (skipped for Editor) */}
                {serviceRole !== 'Editor' && (
                  <div className="space-y-4 border-t border-gray-150 pt-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-700 font-bold flex items-center space-x-2">
                        <Settings className="w-3.5 h-3.5 text-[#2F3A8F]" />
                        <span>Production Gear Package</span>
                      </h4>
                      <p className="text-slate-400 text-[11px] font-light">Pilih paket alat visual yang akan digunakan saat produksi.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['Basic', 'Professional', 'Custom'] as const).map(pkg => (
                        <button
                          key={pkg}
                          type="button"
                          onClick={() => setPackageType(pkg)}
                          className={`p-4 text-left rounded-lg border transition-all duration-300 ${
                            packageType === pkg
                              ? 'border-[#2F3A8F] bg-[#2F3A8F]/5'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-xs uppercase tracking-wider font-bold text-slate-700">{pkg} Package</div>
                          <div className="text-[10px] text-slate-400 font-light mt-1">
                            {pkg === 'Basic' && 'Kamera entry-level + basic lighting/audio'}
                            {pkg === 'Professional' && 'Kamera pro + Drone + Gimbal + Premium audio'}
                            {pkg === 'Custom' && 'Pilih sendiri daftar equipment dari database'}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Equipment List */}
                    {packageType === 'Custom' && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3 animate-fade-in">
                        {masterData.equipment.map(eq => (
                          <label key={eq.id} className="flex items-center space-x-3 text-xs text-slate-600 hover:text-slate-800 cursor-pointer py-1">
                            <input
                              type="checkbox"
                              checked={selectedEquipment.includes(eq.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEquipment([...selectedEquipment, eq.name]);
                                } else {
                                  setSelectedEquipment(selectedEquipment.filter(n => n !== eq.name));
                                }
                              }}
                              className="rounded border-gray-300 text-[#2F3A8F] focus:ring-[#2F3A8F]"
                            />
                            <span>{eq.name} <span className="text-slate-400 font-light">({formatIDR(eq.pricePerHour)}/jam)</span></span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Labor / Crew Selection */}
                <div className="space-y-4 border-t border-gray-150 pt-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-700 font-bold flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-[#2F3A8F]" />
                      <span>Crew & Tenaga Kerja Tambahan</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] font-light">Pilih personel tambahan yang dibutuhkan (Peran Utama sudah otomatis masuk).</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-white border border-gray-200 rounded-lg p-4">
                    {masterData.labor
                      // filter out primary serviceRole to avoid duplicates
                      .filter(l => {
                        const r = l.role.toLowerCase();
                        if (serviceRole === 'Videographer' && r === 'videografer') return false;
                        if (serviceRole === 'Photographer' && r === 'fotografer') return false;
                        if (serviceRole === 'Editor' && r === 'editor') return false;
                        return true;
                      })
                      .map(l => (
                        <label key={l.id} className="flex items-center space-x-3 text-xs text-slate-600 hover:text-slate-800 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={selectedLabor.includes(l.role)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLabor([...selectedLabor, l.role]);
                              } else {
                                setSelectedLabor(selectedLabor.filter(r => r !== l.role));
                              }
                            }}
                            className="rounded border-gray-300 text-[#2F3A8F] focus:ring-[#2F3A8F]"
                          />
                          <span>{l.role}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Complexity Parameters Scoring */}
                <div className="space-y-4 border-t border-gray-150 pt-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-700 font-bold flex items-center space-x-2">
                      <Coins className="w-3.5 h-3.5 text-[#2F3A8F]" />
                      <span>Development Complexity (Scoring)</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] font-light">Tentukan tingkat kesulitan proyek untuk menghitung nilai Development Fee & profit markup.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white border border-gray-200 rounded-lg p-5">
                    {scoreParameters.map(param => {
                      const options = masterData.scoreOptions.filter(o => o.parameter === param);
                      return (
                        <div key={param} className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-400">{param}</label>
                          <select
                            value={selectedScoreOptions[param] || ''}
                            onChange={(e) => setSelectedScoreOptions({
                              ...selectedScoreOptions,
                              [param]: e.target.value
                            })}
                            className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:ring-1 focus:ring-[#2F3A8F]"
                          >
                            {options.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.optionLabel} (+{opt.score} Poin)
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* B. Content Asset (CA) Form */}
            {formCategory === 'CA' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Select Asset Item */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-[#2F3A8F]" />
                      <span>Pilih Jenis Content Asset</span>
                    </label>
                    <select
                      value={selectedAsset}
                      onChange={(e) => setSelectedAsset(e.target.value)}
                      className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F]"
                    >
                      {masterData.assetPrices.map(asset => (
                        <option key={asset.id} value={asset.name}>
                          [{asset.category}] {asset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity selector */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                      Jumlah Kebutuhan Asset
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setAssetQuantity(Math.max(1, assetQuantity - 1))}
                        className="w-12 h-12 rounded border border-gray-200 bg-white flex items-center justify-center font-bold hover:bg-gray-50 text-slate-600 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={assetQuantity}
                        onChange={(e) => setAssetQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-20 text-center glass-input h-12 text-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setAssetQuantity(assetQuantity + 1)}
                        className="w-12 h-12 rounded border border-gray-200 bg-white flex items-center justify-center font-bold hover:bg-gray-50 text-slate-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Action */}
            <div className="flex justify-end pt-4 border-t border-gray-150">
              <button
                type="submit"
                className="group flex items-center justify-center space-x-2 bg-[#2F3A8F] text-white font-bold text-xs tracking-widest px-8 py-4 rounded hover:bg-[#1E255C] transition-all duration-300 shadow-md"
              >
                <span>LANJUT KE KONTAK</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-[#F2B705]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 1: AI-BASED ESTIMATOR */}
        {step === 1 && activeTab === 'ai' && (
          <form onSubmit={handleNextStep} className="glass-panel p-8 md:p-12 rounded-xl shadow-sm space-y-6 animate-scale-in">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#F2B705] animate-pulse" />
                <span>Tulis Detail Kebutuhan Project Anda</span>
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Contoh: Saya membutuhkan videografer untuk memproduksi video company profile 1 hari di Sidoarjo. Menggunakan kamera professional, mic audio, dan drone pilot. Butuh tambahan editor untuk menyunting video..."
                rows={6}
                required
                className="w-full glass-input px-5 py-4 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F] resize-none leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 block leading-relaxed">
                * AI Pricing Engine akan membaca deskripsi Anda secara cerdas, mengidentifikasi peralatan, lokasi akomodasi, kebutuhan kru, serta kompleksitas untuk menghitung estimasi biaya otomatis.
              </span>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-150">
              <button
                type="submit"
                className="group flex items-center justify-center space-x-2 bg-[#2F3A8F] text-white font-bold text-xs tracking-widest px-8 py-4 rounded hover:bg-[#1E255C] transition-all duration-300 shadow-md"
              >
                <span>LANJUT KE KONTAK</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-[#F2B705]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CONTACT INFORMATION */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-12 rounded-xl shadow-sm space-y-8 animate-scale-in max-w-3xl mx-auto">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-700 font-bold">Informasi Kontak Anda</h3>
              <p className="text-slate-400 text-xs font-light">Kami memerlukan kontak Anda untuk keperluan integrasi tracking status project.</p>
            </div>

            <div className="space-y-6">
              {/* Client Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Nama Lengkap / Instansi <span className="text-[#2F3A8F] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Budi Santoso / PT Sinar Utama"
                  className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F]"
                />
              </div>

              {/* Client Whatsapp */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Nomor WhatsApp (Aktif) <span className="text-[#2F3A8F] font-bold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={clientWhatsapp}
                  onChange={(e) => setClientWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F]"
                />
              </div>

              {/* Client Email */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Contoh: budi@sinar.co.id"
                  className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F]"
                />
              </div>

              {/* Special Request */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Catatan Khusus (Optional)
                </label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Referensi video, format file target, atau deadline spesifik..."
                  rows={3}
                  className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#2F3A8F] focus:border-[#2F3A8F] resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-150">
              <button
                type="button"
                onClick={handleBackStep}
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors py-2 px-4"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center justify-center space-x-2 bg-[#2F3A8F] text-white font-bold text-xs tracking-widest px-8 py-4 rounded hover:bg-[#1E255C] transition-all duration-300 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>MENGHITUNG...</span>
                  </>
                ) : (
                  <>
                    <span>HITUNG ESTIMASI</span>
                    <Check className="w-4 h-4 text-[#F2B705]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CALCULATION RESULTS */}
        {step === 3 && minPrice !== null && maxPrice !== null && (
          <div className="glass-panel p-8 md:p-12 rounded-xl shadow-md space-y-10 text-center animate-scale-in relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#2F3A8F]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#2F3A8F]/10 text-[#2F3A8F] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#F2B705]" />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#2F3A8F] font-bold block">
                HASIL ESTIMASI SMART PRICING
              </span>
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-slate-800 tracking-wide py-2">
                {formatIDR(minPrice)} — {formatIDR(maxPrice)}
              </h3>
              
              {calculationBreakdown?.category && (
                <div className="inline-flex items-center px-3 py-1 rounded bg-[#2F3A8F]/5 border border-[#2F3A8F]/20 text-xs font-bold text-[#2F3A8F] uppercase tracking-wider">
                  Skala Proyek: {calculationBreakdown.category} ({calculationBreakdown.score} Poin)
                </div>
              )}
            </div>

            {/* AI Explanation if available */}
            {aiAnalysisText && (
              <div className="bg-[#2F3A8F]/5 border border-[#2F3A8F]/10 rounded-lg p-5 text-left max-w-2xl mx-auto space-y-2">
                <h5 className="text-[10px] uppercase font-bold text-[#2F3A8F] tracking-wider flex items-center space-x-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#F2B705]" />
                  <span>Analisis AI Pricing Engine</span>
                </h5>
                <p className="text-slate-600 text-xs leading-relaxed font-light">{aiAnalysisText}</p>
              </div>
            )}

            {/* Granular Cost Breakdown List for Transparency */}
            {calculationBreakdown && calculationBreakdown.breakdown && (
              <div className="border border-gray-200 bg-white rounded-lg p-6 text-left max-w-2xl mx-auto space-y-4 shadow-sm">
                <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RINCIAN PERHITUNGAN BIAYA</h5>
                <div className="space-y-2.5 text-xs text-slate-600">
                  {/* Fixed Cost / Equipment */}
                  {calculationBreakdown.breakdown.fixedCost > 0 && (
                    <div className="flex justify-between">
                      <span>Biaya Penggunaan Peralatan (Fixed Cost)</span>
                      <span className="font-semibold text-slate-800">{formatIDR(calculationBreakdown.breakdown.fixedCost)}</span>
                    </div>
                  )}
                  {/* Development Fee */}
                  {calculationBreakdown.breakdown.developmentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Biaya Kompleksitas & Desain (Development Fee)</span>
                      <span className="font-semibold text-slate-800">{formatIDR(calculationBreakdown.breakdown.developmentFee)}</span>
                    </div>
                  )}
                  {/* Labor Cost */}
                  {calculationBreakdown.breakdown.laborCost > 0 && (
                    <div className="flex justify-between">
                      <span>Jasa Crew & Tenaga Kerja (Labor Cost)</span>
                      <span className="font-semibold text-slate-800">{formatIDR(calculationBreakdown.breakdown.laborCost)}</span>
                    </div>
                  )}
                  {/* Variable Cost */}
                  {calculationBreakdown.breakdown.variableCost > 0 && (
                    <div className="flex justify-between">
                      <span>Akomodasi & Transportasi (Variable Cost)</span>
                      <span className="font-semibold text-slate-800">{formatIDR(calculationBreakdown.breakdown.variableCost)}</span>
                    </div>
                  )}
                  {/* Profit Markup */}
                  {calculationBreakdown.breakdown.profitMarkup > 0 && (
                    <div className="flex justify-between border-t border-gray-100 pt-2.5">
                      <span>Profit Margin Adjustment (+{(calculationBreakdown.breakdown.profitPercentage * 100).toFixed(0)}%)</span>
                      <span className="font-semibold text-slate-800">{formatIDR(calculationBreakdown.breakdown.profitMarkup)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Code Card */}
            <div className="bg-gray-50 border border-gray-150 rounded-lg p-6 max-w-2xl mx-auto space-y-4 shadow-sm text-left">
              <div className="flex items-center justify-between text-xs tracking-wider">
                <span className="text-slate-400 uppercase font-semibold">KODE TRACKING KONSULTASI</span>
                <span className="text-[#2F3A8F] font-bold">AKTIF</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded px-4 py-3">
                <code className="text-sm md:text-base font-bold text-slate-800 tracking-widest uppercase">
                  {trackingCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-slate-800 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Clipboard size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Gunakan kode di atas pada halaman <a href="/tracking" target="_blank" className="text-[#2F3A8F] font-semibold underline hover:text-[#1E255C]">Track Project</a> untuk memantau proses negosiasi dan kesiapan produksi oleh tim RTS secara real-time.
              </p>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <button
                onClick={handleWhatsAppRedirect}
                className="group flex items-center justify-center space-x-3 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs tracking-widest py-4 px-6 rounded transition-all duration-300 shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>NEGOSIASI VIA WHATSAPP</span>
              </button>
              <button
                onClick={handleReset}
                className="group flex items-center justify-center space-x-2 w-full bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-semibold text-xs tracking-widest py-4 px-6 rounded transition-all duration-300"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span>HITUNG ULANG</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
