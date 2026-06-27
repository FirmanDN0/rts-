'use client';

import { useState, useEffect } from 'react';
import { Settings2, Edit2, DollarSign, RefreshCw, X, Save } from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [basePriceInput, setBasePriceInput] = useState('');
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setNameInput(service.name);
    setDescriptionInput(service.description);
    setBasePriceInput(service.basePrice.toString());
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !nameInput || !descriptionInput || !basePriceInput) {
      alert('Mohon isi semua field wajib.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedService.id,
          name: nameInput,
          description: descriptionInput,
          basePrice: parseFloat(basePriceInput),
        }),
      });

      if (res.ok) {
        await fetchServices();
        setSelectedService(null);
      }
    } catch (err) {
      console.error('Error updating service:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-wide">
          Manage Studio Services
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-light mt-1">
          Sesuaikan nama, deskripsi, dan tarif dasar layanan utama RTS.
          Harga dasar di bawah ini digunakan sebagai referensi utama kalkulator estimasi otomatis client.
        </p>
      </div>

      {/* Services Grid list */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-[#0033A0]" />
          <span>Memuat data layanan...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-panel bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-sm"
            >
              <div className="h-44 w-full relative bg-slate-900">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-800 leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 text-xs font-light mt-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Base rate card block */}
                  <div className="border-t border-gray-150 pt-4">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                      TARIF DASAR KALKULATOR
                    </span>
                    <div className="flex items-center space-x-1 text-lg font-bold text-[#0033A0]">
                      <DollarSign className="w-4.5 h-4.5 text-[#FDB913]" />
                      <span>{formatIDR(service.basePrice)}</span>
                    </div>
                  </div>

                  {/* Edit action */}
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="flex items-center justify-center space-x-2 w-full bg-gray-50 border border-gray-200 hover:border-[#0033A0] hover:bg-[#0033A0]/5 text-slate-700 font-semibold text-xs tracking-wider py-2.5 rounded transition-all duration-300"
                  >
                    <Edit2 size={13} className="text-[#0033A0]" />
                    <span>SUNTING DETAIL</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveChanges}
            className="relative w-full max-w-xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl animate-scale-in"
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-800 flex items-center space-x-2">
                <Settings2 size={16} className="text-[#0033A0]" />
                <span>Sunting Layanan Studio</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 md:p-8 space-y-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                  Nama Layanan *
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Contoh: Film Production"
                  className="w-full glass-input px-4 py-2.5 text-sm"
                />
              </div>

              {/* Base Price */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold flex items-center justify-between">
                  <span>Harga Tarif Dasar (IDR) *</span>
                  <span className="text-[9px] text-slate-400 font-light normal-case">
                    Mempengaruhi formula min/max estimasi kalkulator
                  </span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    required
                    value={basePriceInput}
                    onChange={(e) => setBasePriceInput(e.target.value)}
                    placeholder="Contoh: 5000000"
                    className="w-full glass-input pl-10 pr-4 py-2.5 text-sm font-semibold tracking-wide text-[#0033A0]"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
                    Rp
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                  Deskripsi Layanan *
                </label>
                <textarea
                  required
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Deskripsikan cakupan pengerjaan layanan secara singkat..."
                  rows={5}
                  className="w-full glass-input px-4 py-2.5 text-sm resize-none"
                />
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-750 transition-colors"
              >
                Batal
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
                    <span>SIMPAN LAYANAN</span>
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
