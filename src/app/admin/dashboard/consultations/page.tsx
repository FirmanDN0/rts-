'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Edit2, User, Phone, Check, RefreshCw, X, DollarSign, Save } from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

interface Consultation {
  id: string;
  trackingCode: string;
  clientName: string;
  clientWhatsapp: string;
  clientEmail?: string;
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
  notes?: string;
  createdAt: string;
  consultationType?: string;
  serviceRole?: string;
  productionType?: string;
  durationHours?: number;
  optionsJson?: string;
  calculationJson?: string;
}

export default function ConsultationsManagementPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const [negotiatedPriceInput, setNegotiatedPriceInput] = useState('');
  const [statusInput, setStatusInput] = useState('PENDING');
  const [notesInput, setNotesInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Parse breakdown details from JSON helper
  const getParsedCalculation = (item: Consultation) => {
    if (!item.calculationJson) return null;
    try {
      return JSON.parse(item.calculationJson);
    } catch (e) {
      return null;
    }
  };

  async function fetchConsultations() {
    try {
      const res = await fetch('/api/consultations');
      if (res.ok) {
        const data = await res.json();
        setConsultations(data);
        setFilteredConsultations(data);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Filter application
  useEffect(() => {
    let result = consultations;

    // Search by client name
    if (search.trim() !== '') {
      result = result.filter(c => 
        c.clientName.toLowerCase().includes(search.toLowerCase()) ||
        c.trackingCode.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    setFilteredConsultations(result);
  }, [search, statusFilter, consultations]);

  const handleOpenEditModal = (item: Consultation) => {
    setSelectedItem(item);
    setNegotiatedPriceInput(item.negotiatedPrice?.toString() || '');
    setStatusInput(item.status);
    setNotesInput(item.notes || '');
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSaving(true);
    try {
      const negotiatedPrice = negotiatedPriceInput.trim() === '' ? null : parseFloat(negotiatedPriceInput);

      const res = await fetch(`/api/consultations/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusInput,
          negotiatedPrice,
          notes: notesInput,
        }),
      });

      if (res.ok) {
        // Refresh local data list
        await fetchConsultations();
        setSelectedItem(null);
      }
    } catch (err) {
      console.error('Error saving consultation updates:', err);
    } finally {
      setSaving(false);
    }
  };

  const triggerWhatsAppChat = (item: Consultation) => {
    // Generate pre-negotiated text to client
    const text = `Halo Kak ${item.clientName}, saya Admin RTS ingin menindaklanjuti konsultasi project Kakak dengan Kode Tracking: ${item.trackingCode}.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${item.clientWhatsapp.replace(/^0/, '62')}?text=${encodedText}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-105 text-gray-600 border-gray-200';
      case 'REVIEW':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'NEGOTIATION':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'APPROVED':
        return 'bg-[#0033A0]/10 text-[#0033A0] border-[#0033A0]/20';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // Helper variables for modal
  const calc = selectedItem ? getParsedCalculation(selectedItem) : null;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-wide">
          Manage Consultations
        </h1>
        <p className="text-slate-450 text-xs md:text-sm font-light mt-1">
          Tinjau detail pengajuan konsultasi client, sesuaikan harga negosiasi, dan update status timeline.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama client atau kode tracking..."
            className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        {/* Status filter selection */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 glass-input px-3 py-2 text-sm focus:ring-1 focus:ring-[#0033A0] focus:border-[#0033A0]"
          >
            <option value="All">Semua Status</option>
            <option value="PENDING">PENDING</option>
            <option value="REVIEW">REVIEW</option>
            <option value="NEGOTIATION">NEGOTIATION</option>
            <option value="APPROVED">APPROVED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Table grid layout */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-[#0033A0]" />
          <span>Memuat data konsultasi...</span>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 rounded bg-white">
          <p className="text-slate-400 tracking-wider">Tidak ditemukan data pengajuan konsultasi.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
                  <th className="p-4 pl-6">Kode Track</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Layanan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Estimasi / Final</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 font-light text-slate-600">
                {filteredConsultations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold tracking-widest text-slate-800">
                      {item.trackingCode}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{item.clientName}</td>
                    <td className="p-4">{item.clientWhatsapp}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-slate-600 font-medium">
                        {item.serviceType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.negotiatedPrice ? (
                        <span className="text-[#0033A0] font-bold">
                          {formatIDR(item.negotiatedPrice)}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {formatIDR(item.estimatedPriceMin)} - {formatIDR(item.estimatedPriceMax)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded hover:bg-gray-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Edit Status & Harga"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerWhatsAppChat(item)}
                          className="p-1.5 rounded hover:bg-[#25D366]/10 text-slate-400 hover:text-[#25D366] transition-colors"
                          title="Hubungi Client via WA"
                        >
                          <MessageSquare size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit Detail Consultation */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveChanges}
            className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl animate-scale-in"
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-[#0033A0] font-bold tracking-widest">{selectedItem.trackingCode}</span>
                <span className="text-slate-350">•</span>
                <span className="text-xs uppercase font-semibold text-slate-500">Detail & Update Status</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-lg text-xs font-light text-slate-600">
                <div className="flex items-center space-x-2">
                  <User size={14} className="text-[#0033A0]" />
                  <span>Client: <strong className="text-slate-800">{selectedItem.clientName}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-[#0033A0]" />
                  <span>WhatsApp: <strong className="text-slate-800">{selectedItem.clientWhatsapp}</strong></span>
                </div>
                {selectedItem.clientEmail && (
                  <div className="col-span-2 border-t border-gray-200 pt-2 text-[11px]">
                    <span>Email: <strong className="text-slate-800">{selectedItem.clientEmail}</strong></span>
                  </div>
                )}
                <div className="col-span-2 border-t border-gray-200 pt-2 mt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                    Kebutuhan Singkat:
                  </span>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-700">
                    <span className="bg-gray-200/60 px-2 py-0.5 rounded">Layanan: {selectedItem.serviceType}</span>
                    <span className="bg-gray-200/60 px-2 py-0.5 rounded">Durasi: {selectedItem.duration}</span>
                    <span className="bg-gray-200/60 px-2 py-0.5 rounded">Lokasi: {selectedItem.location}</span>
                    <span className="bg-gray-200/60 px-2 py-0.5 rounded">Talent: {selectedItem.talent ? 'Ya' : 'Tidak'}</span>
                    <span className="bg-gray-200/60 px-2 py-0.5 rounded">Gear Premium: {selectedItem.equipment ? 'Ya' : 'Tidak'}</span>
                  </div>
                </div>

                {/* Granular Cost Breakdown in Admin Details */}
                {calc && (
                  <div className="col-span-2 border-t border-gray-200 pt-3 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
                      Rincian Biaya Sistem Smart Pricing:
                    </span>
                    <div className="bg-white rounded border border-gray-200 p-3.5 space-y-2 text-[11px] font-normal text-slate-650">
                      {calc.category && (
                        <div className="flex justify-between font-bold border-b border-gray-100 pb-1.5 text-[#0033A0]">
                          <span>Kategori Kompleksitas Proyek:</span>
                          <span>{calc.category} ({calc.score} Poin)</span>
                        </div>
                      )}
                      
                      {calc.breakdown && (
                        <div className="space-y-1.5">
                          {calc.breakdown.fixedCost > 0 && (
                            <div className="flex justify-between">
                              <span>Sewa Equipment (Fixed Cost):</span>
                              <span className="font-semibold text-slate-800">{formatIDR(calc.breakdown.fixedCost)}</span>
                            </div>
                          )}
                          {calc.breakdown.developmentFee > 0 && (
                            <div className="flex justify-between">
                              <span>Complexity Fee (Development):</span>
                              <span className="font-semibold text-slate-800">{formatIDR(calc.breakdown.developmentFee)}</span>
                            </div>
                          )}
                          {calc.breakdown.laborCost > 0 && (
                            <div className="flex justify-between">
                              <span>Crew Labor Cost:</span>
                              <span className="font-semibold text-slate-800">{formatIDR(calc.breakdown.laborCost)}</span>
                            </div>
                          )}
                          {calc.breakdown.variableCost > 0 && (
                            <div className="flex justify-between">
                              <span>Akomodasi / Variabel:</span>
                              <span className="font-semibold text-slate-800">{formatIDR(calc.breakdown.variableCost)}</span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-gray-100 pt-1.5 font-bold text-slate-800">
                            <span>Estimasi Total:</span>
                            <span>{formatIDR(selectedItem.estimatedPriceMin)} - {formatIDR(selectedItem.estimatedPriceMax)}</span>
                          </div>
                        </div>
                      )}

                      {/* Equipment List */}
                      {calc.equipmentItems && calc.equipmentItems.length > 0 && (
                        <div className="border-t border-gray-100 pt-2 mt-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Equipment Detail:</span>
                          <div className="text-[10px] text-slate-500 font-light flex flex-wrap gap-1.5">
                            {calc.equipmentItems.map((eq: any, idx: number) => (
                              <span key={idx} className="bg-gray-50 border border-gray-150 px-2 py-0.5 rounded">
                                {eq.name} ({formatIDR(eq.pricePerHour)}/jam)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Labor List */}
                      {calc.laborItems && calc.laborItems.length > 0 && (
                        <div className="border-t border-gray-100 pt-2 mt-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Kru / Personil Detail:</span>
                          <div className="text-[10px] text-slate-500 font-light flex flex-wrap gap-1.5">
                            {calc.laborItems.map((lab: any, idx: number) => (
                              <span key={idx} className="bg-gray-50 border border-gray-150 px-2 py-0.5 rounded">
                                {lab.role} ({formatIDR(lab.rate)})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI explanation */}
                      {calc.aiAnalysis && (
                        <div className="border-t border-gray-100 pt-2 mt-1">
                          <span className="text-[9px] uppercase font-bold text-[#0033A0] block mb-1">Analisis AI:</span>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-light italic">
                            "{calc.aiAnalysis.explanation}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedItem.specialRequest && (
                  <div className="col-span-2 mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                      Request Khusus Client:
                    </span>
                    <p className="p-2.5 bg-white rounded border border-gray-250 italic text-[11px] leading-relaxed text-slate-600">
                      "{selectedItem.specialRequest}"
                    </p>
                  </div>
                )}
              </div>

              {/* Editing Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Status Update */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    Status Timeline Project
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full glass-input px-4 py-3 text-sm focus:ring-1 focus:ring-[#0033A0] focus:border-[#0033A0]"
                  >
                    <option value="PENDING">PENDING (Awaiting Review)</option>
                    <option value="REVIEW">REVIEW (Analyzing)</option>
                    <option value="NEGOTIATION">NEGOTIATION (Price Negotiation)</option>
                    <option value="APPROVED">APPROVED (DP Paid / Confirmed)</option>
                    <option value="COMPLETED">COMPLETED (Asset Delivered)</option>
                  </select>
                </div>

                {/* Negotiated Price */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold flex items-center justify-between">
                    <span>Harga Disepakati (IDR)</span>
                    <span className="text-[9px] text-slate-400 font-light normal-case">
                      Est: {formatIDR(selectedItem.estimatedPriceMin)} - {formatIDR(selectedItem.estimatedPriceMax)}
                    </span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      value={negotiatedPriceInput}
                      onChange={(e) => setNegotiatedPriceInput(e.target.value)}
                      placeholder="Masukkan harga deal, e.g. 8500000"
                      className="w-full glass-input pl-10 pr-4 py-3 text-sm font-semibold tracking-wide text-[#0033A0]"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
                      Rp
                    </div>
                  </div>
                </div>

              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                  Catatan Internal RTS (Hanya Terlihat Oleh Admin)
                </label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Catatan terkait kesepakatan harga, jadwal shooting, revisi, dll..."
                  rows={4}
                  className="w-full glass-input px-4 py-3 text-sm resize-none"
                />
              </div>

            </div>

            {/* Actions Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={saving}
                className="group flex items-center justify-center space-x-2 bg-[#0033A0] text-white font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-[#002D9C] transition-all duration-300 shadow-sm"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>MENYIMPAN...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#FDB913]" />
                    <span>SIMPAN PERUBAHAN</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
