'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Check, RefreshCw, X, Save, Image, Film } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  category: string;
  year: string;
  featured: boolean;
}

export default function PortfolioManagementPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form Modal States
  const [selectedItem, setSelectedItem] = useState<Portfolio | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [titleInput, setTitleInput] = useState('');
  const [thumbnailInput, setThumbnailInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Film Production');
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  const [featuredInput, setFeaturedInput] = useState(false);

  async function fetchPortfolios() {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data);
        setFilteredPortfolios(data);
      }
    } catch (err) {
      console.error('Error fetching portfolios:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPortfolios();
  }, []);

  // Filter Portfolios
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredPortfolios(portfolios);
    } else {
      setFilteredPortfolios(
        portfolios.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase()) ||
            p.year.includes(search)
        )
      );
    }
  }, [search, portfolios]);

  const handleOpenAddModal = () => {
    setIsAddMode(true);
    setSelectedItem(null);
    setTitleInput('');
    setThumbnailInput('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800');
    setVideoInput('https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4');
    setDescriptionInput('');
    setCategoryInput('Film Production');
    setYearInput(new Date().getFullYear().toString());
    setFeaturedInput(false);
  };

  const handleOpenEditModal = (item: Portfolio) => {
    setIsAddMode(false);
    setSelectedItem(item);
    setTitleInput(item.title);
    setThumbnailInput(item.thumbnailUrl);
    setVideoInput(item.videoUrl);
    setDescriptionInput(item.description);
    setCategoryInput(item.category);
    setYearInput(item.year);
    setFeaturedInput(item.featured);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput || !thumbnailInput || !videoInput || !descriptionInput || !yearInput) {
      alert('Mohon isi semua field wajib.');
      return;
    }

    setSaving(true);
    const bodyData = {
      title: titleInput,
      thumbnailUrl: thumbnailInput,
      videoUrl: videoInput,
      description: descriptionInput,
      category: categoryInput,
      year: yearInput,
      featured: featuredInput,
    };

    try {
      let res;
      if (isAddMode) {
        res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
      } else if (selectedItem) {
        res = await fetch(`/api/portfolio/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
      }

      if (res && res.ok) {
        await fetchPortfolios();
        setIsAddMode(false);
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karya portfolio ini secara permanen?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPortfolios();
      }
    } catch (err) {
      console.error('Error deleting portfolio:', err);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-wide">
            Portfolio Management
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-light mt-1">
            Tambah, sunting, atau hapus video showreel dan karya kreatif yang ditampilkan di beranda utama.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 bg-[#0033A0] hover:bg-[#002D9C] text-white font-bold text-xs tracking-widest px-5 py-3 rounded transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#FDB913]" />
          <span>TAMBAH KARYA</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul, kategori, atau tahun..."
          className="w-full glass-input pl-10 pr-4 py-2.5 text-sm"
        />
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
      </div>

      {/* Portfolio Items Table/List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center space-x-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-[#0033A0]" />
          <span>Memuat data portfolio...</span>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 rounded bg-white">
          <p className="text-slate-400 tracking-wider">Belum ada karya portfolio terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((item) => (
            <div
              key={item.id}
              className="glass-panel bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-sm"
            >
              <div className="aspect-video w-full relative bg-slate-900">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80"
                />
                {item.featured && (
                  <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest font-semibold bg-[#0033A0] text-white px-2 py-0.5 rounded shadow">
                    FEATURED
                  </span>
                )}
                <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-widest font-semibold bg-black/60 px-2 py-0.5 rounded text-white/70">
                  {item.year}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#0033A0]">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-slate-800 mt-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-light mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px] font-mono">
                    {item.videoUrl.split('/').pop()?.substring(0, 15)}...
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded hover:bg-gray-100 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Edit Karya"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-650 transition-colors"
                      title="Hapus Karya"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
            className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl animate-scale-in"
          >
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-800">
                {isAddMode ? 'Tambah Karya Portfolio Baru' : 'Sunting Detail Karya'}
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

            {/* Scrollable Form Body */}
            <div className="p-6 md:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                  Judul Project / Karya *
                </label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Contoh: Ethereal Silence — Cinematic Short Film"
                  className="w-full glass-input px-4 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                    Kategori Karya *
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full glass-input px-4 py-2.5 text-sm"
                  >
                    <option value="Film Production">Film Production</option>
                    <option value="Animation">Animation</option>
                    <option value="Motion Graphic">Motion Graphic</option>
                    <option value="Creative Visual">Creative Visual</option>
                  </select>
                </div>

                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                    Tahun Produksi *
                  </label>
                  <input
                    type="text"
                    required
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    placeholder="Contoh: 2026"
                    className="w-full glass-input px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold flex items-center space-x-1">
                  <Image size={12} className="text-[#0033A0]" />
                  <span>Link URL Thumbnail Gambar *</span>
                </label>
                <input
                  type="url"
                  required
                  value={thumbnailInput}
                  onChange={(e) => setThumbnailInput(e.target.value)}
                  placeholder="Contoh: https://images.unsplash.com/photo-..."
                  className="w-full glass-input px-4 py-2.5 text-slate-500 font-mono text-xs"
                />
              </div>

              {/* Video URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold flex items-center space-x-1">
                  <Film size={12} className="text-[#0033A0]" />
                  <span>Link URL Showreel / Video *</span>
                </label>
                <input
                  type="url"
                  required
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="Contoh: https://assets.mixkit.co/... .mp4"
                  className="w-full glass-input px-4 py-2.5 text-slate-500 font-mono text-xs"
                />
                <span className="text-[9px] text-slate-400 block">
                  Support link file MP4 langsung (untuk autoplay hover) atau embed Youtube.
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
                  Deskripsi Singkat Karya *
                </label>
                <textarea
                  required
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Terangkan cerita di balik project ini, teknik pengerjaan, atau software yang digunakan..."
                  rows={4}
                  className="w-full glass-input px-4 py-2.5 text-sm resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featuredInput}
                  onChange={(e) => setFeaturedInput(e.target.checked)}
                  className="w-4.5 h-4.5 accent-[#0033A0] bg-white border-gray-200 rounded cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs text-slate-700 font-semibold cursor-pointer selection:bg-transparent">
                  Tampilkan sebagai Karya Utama (Featured Project)
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
                className="group flex items-center justify-center space-x-2 bg-[#0033A0] text-white font-bold text-xs tracking-widest px-6 py-3 rounded hover:bg-[#002D9C] transition-all duration-300 shadow-sm"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>MENYIMPAN...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#FDB913]" />
                    <span>SIMPAN KARYA</span>
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
