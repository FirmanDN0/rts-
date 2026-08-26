'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  X,
  Save,
  Sparkles,
  Clock,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Layers,
  Film,
  Camera,
  Wand2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { formatIDR } from '@/lib/calculator';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface AddonItem {
  name: string;
  price: number;
}

interface CatalogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  badge?: string | null;
  thumbnailUrl: string;
  sampleVideoUrl?: string | null;
  shortDesc: string;
  fullDesc: string;
  price: number;
  priceUnit?: string | null;
  estimatedDays: string;
  deliverables: string; // JSON
  gearSpecs?: string | null;
  revisions?: string | null;
  addonsJson?: string | null; // JSON
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Film & Commercial');
  const [badge, setBadge] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [sampleVideoUrl, setSampleVideoUrl] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('per project');
  const [estimatedDays, setEstimatedDays] = useState('5 - 7 Hari Kerja');
  const [gearSpecs, setGearSpecs] = useState('');
  const [revisions, setRevisions] = useState('2x Revisi Mayor, Unlimited Minor');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState('0');

  // Deliverables List State
  const [deliverablesList, setDeliverablesList] = useState<string[]>([]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');

  // Addons List State
  const [addonsList, setAddonsList] = useState<AddonItem[]>([]);
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = [
    'Film & Commercial',
    'Animation',
    'Motion Graphic',
    'Content Asset',
    'Production Gear',
  ];

  async function fetchCatalogItems() {
    try {
      setLoading(true);
      const res = await fetch('/api/catalog?all=true');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching catalog items:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCatalogItems();
  }, []);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setSelectedItemId(null);
    setTitle('');
    setSlug('');
    setCategory('Film & Commercial');
    setBadge('');
    setThumbnailUrl('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800');
    setSampleVideoUrl('');
    setShortDesc('');
    setFullDesc('');
    setPrice('5000000');
    setPriceUnit('per project');
    setEstimatedDays('5 - 7 Hari Kerja');
    setGearSpecs('Cinema Camera 4K, Set Lensa Prime, Wireless Audio');
    setRevisions('2x Revisi Mayor, Unlimited Minor');
    setIsFeatured(false);
    setIsActive(true);
    setOrder('0');
    setDeliverablesList([
      '1x Master Video 4K (60s)',
      'Color Grading Sinematik',
      'Sound Design & Lisensi Musik Legal',
    ]);
    setAddonsList([
      { name: 'Drone Aerial 4K Cinematography', price: 1200000 },
      { name: 'Professional Voice Over Artist', price: 750000 },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CatalogItem) => {
    setIsEditMode(true);
    setSelectedItemId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setCategory(item.category);
    setBadge(item.badge || '');
    setThumbnailUrl(item.thumbnailUrl);
    setSampleVideoUrl(item.sampleVideoUrl || '');
    setShortDesc(item.shortDesc);
    setFullDesc(item.fullDesc);
    setPrice(item.price.toString());
    setPriceUnit(item.priceUnit || 'per project');
    setEstimatedDays(item.estimatedDays);
    setGearSpecs(item.gearSpecs || '');
    setRevisions(item.revisions || '2x Revisi Mayor');
    setIsFeatured(item.isFeatured);
    setIsActive(item.isActive);
    setOrder(item.order.toString());

    // Parse Deliverables
    try {
      const parsed = JSON.parse(item.deliverables);
      setDeliverablesList(Array.isArray(parsed) ? parsed : []);
    } catch {
      setDeliverablesList([]);
    }

    // Parse Addons
    try {
      const parsed = JSON.parse(item.addonsJson || '[]');
      setAddonsList(Array.isArray(parsed) ? parsed : []);
    } catch {
      setAddonsList([]);
    }

    setIsModalOpen(true);
  };

  const handleAddDeliverable = () => {
    if (newDeliverableInput.trim()) {
      setDeliverablesList([...deliverablesList, newDeliverableInput.trim()]);
      setNewDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverablesList(deliverablesList.filter((_, i) => i !== index));
  };

  const handleAddAddon = () => {
    if (newAddonName.trim() && newAddonPrice.trim()) {
      setAddonsList([
        ...addonsList,
        {
          name: newAddonName.trim(),
          price: parseFloat(newAddonPrice) || 0,
        },
      ]);
      setNewAddonName('');
      setNewAddonPrice('');
    }
  };

  const handleRemoveAddon = (index: number) => {
    setAddonsList(addonsList.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !thumbnailUrl || !shortDesc || !fullDesc || !price || !category) {
      alert('Mohon lengkapi semua field wajib bertanda bintang (*).');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || undefined,
        category,
        badge: badge || null,
        thumbnailUrl,
        sampleVideoUrl: sampleVideoUrl || null,
        shortDesc,
        fullDesc,
        price: parseFloat(price),
        priceUnit,
        estimatedDays,
        deliverables: deliverablesList,
        gearSpecs: gearSpecs || null,
        revisions: revisions || null,
        addonsJson: addonsList,
        isFeatured,
        isActive,
        order: parseInt(order, 10) || 0,
      };

      let res;
      if (isEditMode && selectedItemId) {
        res = await fetch(`/api/catalog/${selectedItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        await fetchCatalogItems();
        setIsModalOpen(false);
      } else {
        const data = await res.json();
        alert(`Gagal menyimpan paket: ${data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error('Error saving catalog item:', err);
      alert('Gagal menghubungi server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/catalog/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchCatalogItems();
        setDeleteConfirmId(null);
      } else {
        alert('Gagal menghapus item katalog.');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatusQuick = async (item: CatalogItem) => {
    try {
      const res = await fetch(`/api/catalog/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: !item.isActive } : i)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered List
  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#0033A0]/10 text-[#0033A0]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Manajemen Katalog Paket
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-light mt-0.5">
                Kelola paket produksi standar, spesifikasi deliverables, add-on harga, dan status aktif.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/#catalog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Eye size={14} />
            <span>Lihat Halaman Publik</span>
            <ExternalLink size={12} className="text-slate-400" />
          </a>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 bg-[#0033A0] hover:bg-[#002270] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Tambah Paket Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Paket</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{items.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Paket Aktif</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {items.filter((i) => i.isActive).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Featured</span>
          <span className="text-2xl font-bold text-[#0033A0] mt-1 block">
            {items.filter((i) => i.isFeatured).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Kategori</span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">
            {new Set(items.map((i) => i.category)).size}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari paket berdasarkan judul, kategori, atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0033A0]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs sm:text-sm rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#0033A0] w-full sm:w-auto"
          >
            <option value="All">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={fetchCatalogItems}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Catalog Table / Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#0033A0]" />
          <p className="text-xs">Memuat daftar paket katalog...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-slate-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium text-slate-700">Tidak ada paket ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Coba ganti kata kunci pencarian atau tambah paket baru.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Paket & Preview</th>
                  <th className="py-3.5 px-4">Kategori & Badge</th>
                  <th className="py-3.5 px-4">Harga & Satuan</th>
                  <th className="py-3.5 px-4">Waktu Pengerjaan</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3 max-w-sm">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{item.shortDesc}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#0033A0] bg-blue-50 px-2 py-0.5 rounded-full block w-max">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full block w-max">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{formatIDR(item.price)}</span>
                      <span className="text-[10px] text-slate-400">{item.priceUnit || 'per project'}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>{item.estimatedDays}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleStatusQuick(item)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-100 text-slate-400 hover:bg-gray-200'
                        }`}
                      >
                        {item.isActive ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-600 hover:text-[#0033A0] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Paket"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Paket"
                        >
                          <Trash2 size={15} />
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

      {/* ========================================================================= */}
      {/* ADD / EDIT CATALOG MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 relative my-auto animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50 shrink-0">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#0033A0]" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {isEditMode ? 'Edit Paket Katalog' : 'Tambah Paket Katalog Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Judul Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Commercial Brand Film / TVC"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Badge & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Badge Highlight (Opsional)
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  >
                    <option value="">Tanpa Badge</option>
                    <option value="BEST SELLER">BEST SELLER</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="FAST TRACK">FAST TRACK</option>
                    <option value="PROMO">PROMO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    URL Slug (Opsional, terisi otomatis jika kosong)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="contoh: commercial-brand-film"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>
              </div>

              {/* Row 3: Price, Price Unit, Estimated Days */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Harga Dasar (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="8500000"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Satuan Harga
                  </label>
                  <input
                    type="text"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    placeholder="per project / per video / per pack"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Estimasi Waktu Pengerjaan
                  </label>
                  <input
                    type="text"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    placeholder="7 - 10 Hari Kerja"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>
              </div>

              {/* Row 4: Thumbnail Image Upload */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Foto Thumbnail Utama <span className="text-red-500">*</span>
                </label>
                <ImageUpload
                  value={thumbnailUrl}
                  onChange={(url) => setThumbnailUrl(url)}
                />
              </div>

              {/* Row 5: Sample Video URL */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  URL Video Preview / Showreel (Opsional, MP4/Vimeo)
                </label>
                <input
                  type="text"
                  value={sampleVideoUrl}
                  onChange={(e) => setSampleVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/preview/..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                />
              </div>

              {/* Row 6: Short & Full Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Deskripsi Singkat (Tampil di Kartu) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat tentang paket ini..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Deskripsi Lengkap (Tampil di Modal Detail) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Penjelasan detail alur, manfaat, dan keunggulan paket..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                />
              </div>

              {/* Row 7: Deliverables Dynamic Manager */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Item Termasuk (Deliverables)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{deliverablesList.length} item</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Ketik item baru (contoh: 1x Master Video 4K 60s) lalu tekan Enter / Tambah..."
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="bg-[#0033A0] text-white font-bold px-3 py-2 rounded-xl hover:bg-[#002270] transition-colors"
                  >
                    Tambah
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {deliverablesList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-xs text-slate-800"
                    >
                      <span className="truncate">• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-slate-400 hover:text-red-500 ml-2"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Gear Specs & Revisions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Standar Peralatan / Gear Specs
                  </label>
                  <input
                    type="text"
                    value={gearSpecs}
                    onChange={(e) => setGearSpecs(e.target.value)}
                    placeholder="Cinema Camera 4K, Prime Lens, Wireless Audio"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Ketentuan Revisi
                  </label>
                  <input
                    type="text"
                    value={revisions}
                    onChange={(e) => setRevisions(e.target.value)}
                    placeholder="2x Revisi Mayor, Unlimited Minor"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                </div>
              </div>

              {/* Row 9: Addons Dynamic Manager */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-[#0033A0]" />
                    <span>Daftar Opsi Add-On (Opsional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{addonsList.length} addon</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newAddonName}
                    onChange={(e) => setNewAddonName(e.target.value)}
                    placeholder="Nama add-on (misal: Drone 4K)"
                    className="sm:col-span-2 p-2 bg-white border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newAddonPrice}
                      onChange={(e) => setNewAddonPrice(e.target.value)}
                      placeholder="Harga (Rp)"
                      className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0033A0]"
                    />
                    <button
                      type="button"
                      onClick={handleAddAddon}
                      className="bg-[#0033A0] text-white font-bold px-3 py-2 rounded-xl hover:bg-[#002270] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {addonsList.map((addon, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-xs text-slate-800"
                    >
                      <span>{addon.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#0033A0]">+{formatIDR(addon.price)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddon(idx)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 10: Toggles (Active & Featured) */}
              <div className="flex items-center space-x-8 pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#0033A0] rounded focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-slate-800">Paket Aktif (Tampil di Website)</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#0033A0] rounded focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-slate-800">Featured (Prioritas Tampil)</span>
                </label>
              </div>

              {/* Modal Actions Footer */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0033A0] hover:bg-[#002270] text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Paket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Hapus Paket Ini?
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Tindakan ini permanen. Paket yang dihapus tidak akan muncul lagi di website dan katalog.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
