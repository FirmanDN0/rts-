'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Check, RefreshCw, X, Save, Sparkles } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export default function OffersManagementPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [selectedItem, setSelectedItem] = useState<Offer | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isActiveInput, setIsActiveInput] = useState(true);

  async function fetchOffers() {
    try {
      const res = await fetch('/api/offers');
      if (res.ok) {
        const tokenRes = await fetch('/api/offers?all=true');
        if (tokenRes.ok) {
          const data = await tokenRes.json();
          setOffers(data);
          setFilteredOffers(data);
        }
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOffers();
  }, []);

  // Filter list
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredOffers(offers);
    } else {
      setFilteredOffers(
        offers.filter((o) =>
          o.title.toLowerCase().includes(search.toLowerCase()) ||
          o.description.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, offers]);

  const handleOpenAddModal = () => {
    setIsAddMode(true);
    setSelectedItem(null);
    setTitleInput('');
    setDescriptionInput('');
    setIsActiveInput(true);
  };

  const handleOpenEditModal = (item: Offer) => {
    setIsAddMode(false);
    setSelectedItem(item);
    setTitleInput(item.title);
    setDescriptionInput(item.description);
    setIsActiveInput(item.isActive);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput || !descriptionInput) {
      alert('Mohon isi semua field wajib.');
      return;
    }

    setSaving(true);
    const bodyData = {
      title: titleInput,
      description: descriptionInput,
      isActive: isActiveInput,
    };

    try {
      let res;
      if (isAddMode) {
        res = await fetch('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
      } else if (selectedItem) {
        res = await fetch(`/api/offers/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
      }

      if (res && res.ok) {
        await fetchOffers();
        setIsAddMode(false);
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: Offer) => {
    try {
      const res = await fetch(`/api/offers/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !item.isActive,
        }),
      });

      if (res.ok) {
        await fetchOffers();
      }
    } catch (err) {
      console.error('Error toggling offer active status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus promo/pengumuman ini secara permanen?')) return;

    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchOffers();
      }
    } catch (err) {
      console.error('Error deleting offer:', err);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-wide">
            Announcements & Offers
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-light mt-1">
            Kelola pengumuman kolaborasi, paket layanan terbaru, atau penawaran promo diskon yang muncul di landing page.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 bg-[#2F3A8F] hover:bg-[#1E255C] text-white font-bold text-xs tracking-widest px-5 py-3 rounded transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#F2B705]" />
          <span>TAMBAH PENAWARAN</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul promo atau isi pengumuman..."
          className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
        />
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
      </div>

      {/* Offers Grid list */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-[#2F3A8F]" />
          <span>Memuat data penawaran...</span>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 rounded bg-white">
          <p className="text-slate-400 tracking-wider">Belum ada promo/pengumuman terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffers.map((item) => (
            <div
              key={item.id}
              className={`glass-panel border rounded-lg p-6 shadow-sm flex flex-col justify-between space-y-6 transition-colors duration-300 ${
                item.isActive ? 'border-[#2F3A8F]/20 bg-[#2F3A8F]/[0.02]' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#2F3A8F]">
                    <Sparkles className="w-4 h-4 text-[#F2B705]" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">PENAWARAN TERBARU</span>
                  </div>
                  {/* Active Toggle Button status */}
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border transition-colors ${
                      item.isActive
                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                        : 'bg-gray-50 border-gray-200 text-slate-400 hover:text-slate-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.isActive ? 'AKTIF (ON)' : 'MATI (OFF)'}
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-slate-800 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-650 text-xs md:text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-150 pt-4 font-medium">
                <span className="text-[10px] text-slate-400">
                  Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded hover:bg-gray-100 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Edit Promo"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-650 transition-colors"
                    title="Hapus Promo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {(isAddMode || selectedItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleFormSubmit}
            className="relative w-full max-w-xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl animate-scale-in"
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-800">
                {isAddMode ? 'Tambah Penawaran Baru' : 'Sunting Detail Penawaran'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddMode(false);
                  setSelectedItem(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-8 space-y-5">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-650 font-semibold">
                  Judul Promo / Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Contoh: Open Collaboration Project 2026"
                  className="w-full glass-input px-4 py-2.5 text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-650 font-semibold">
                  Isi Deskripsi Pengumuman *
                </label>
                <textarea
                  required
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Deskripsikan penawaran promo, tanggal jatuh tempo, atau syarat kolaborasi secara mendetail..."
                  rows={6}
                  className="w-full glass-input px-4 py-2.5 text-sm resize-none"
                />
              </div>

              {/* Active Toggle Status */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActiveInput}
                  onChange={(e) => setIsActiveInput(e.target.checked)}
                  className="w-4.5 h-4.5 accent-[#2F3A8F] bg-white border-gray-200 rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs text-slate-700 font-semibold cursor-pointer selection:bg-transparent">
                  Aktifkan langsung di Beranda Utama
                </label>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsAddMode(false);
                  setSelectedItem(null);
                }}
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-750 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="group flex items-center justify-center space-x-2 bg-[#2F3A8F] text-white font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-[#1E255C] transition-all duration-300 shadow-sm"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>MENYIMPAN...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#F2B705]" />
                    <span>SIMPAN PENAWARAN</span>
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
