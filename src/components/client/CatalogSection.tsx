'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Sparkles,
  Wand2,
  Layers,
  Camera,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  X,
  Play,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Check,
  Calculator,
} from 'lucide-react';
import { formatIDR } from '@/lib/calculator';

export interface AddonItem {
  name: string;
  price: number;
}

export interface CatalogItem {
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
  deliverables: string; // JSON string
  gearSpecs?: string | null;
  revisions?: string | null;
  addonsJson?: string | null; // JSON string
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

interface CatalogSectionProps {
  initialCategory?: string;
  showAllLink?: boolean;
  isStandalonePage?: boolean;
}

export default function CatalogSection({
  initialCategory = 'All',
  showAllLink = true,
  isStandalonePage = false,
}: CatalogSectionProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'popular'>('featured');
  
  // Modal State
  const [activeModalItem, setActiveModalItem] = useState<CatalogItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Brief Wishlist / Multi-Item Cart
  const [wishlist, setWishlist] = useState<CatalogItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true);
        const res = await fetch('/api/catalog');
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
    fetchCatalog();
  }, []);

  const categories = [
    { id: 'All', label: 'Semua Paket', icon: Sparkles },
    { id: 'Film & Commercial', label: 'Film & Commercial', icon: Film },
    { id: 'Animation', label: 'Animasi 2D/3D', icon: Wand2 },
    { id: 'Motion Graphic', label: 'Motion & Social', icon: Layers },
    { id: 'Content Asset', label: 'Content Asset', icon: Camera },
    { id: 'Production Gear', label: 'Production Gear', icon: Camera },
  ];

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.shortDesc.toLowerCase().includes(q) ||
          item.fullDesc.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.gearSpecs && item.gearSpecs.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'featured') {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || a.order - b.order);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    return result;
  }, [items, selectedCategory, searchQuery, sortBy]);

  // Handle open modal
  const handleOpenDetail = (item: CatalogItem) => {
    setActiveModalItem(item);
    setSelectedAddons({});
    setIsVideoPlaying(false);
  };

  // Helper: Parse JSON safely
  const parseJsonArray = (jsonString?: string | null): any[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Calculate live total price in detail modal with addons
  const modalCalculatedPrice = useMemo(() => {
    if (!activeModalItem) return 0;
    let base = activeModalItem.price;
    const addons = parseJsonArray(activeModalItem.addonsJson);
    addons.forEach((addon: AddonItem) => {
      if (selectedAddons[addon.name]) {
        base += addon.price;
      }
    });
    return base;
  }, [activeModalItem, selectedAddons]);

  // Generate WhatsApp Direct URL
  const generateWhatsAppUrl = (item: CatalogItem, addonsObj: Record<string, boolean> = {}, customTotal?: number) => {
    const rtsWhatsapp = '6281234567890';
    const addons = parseJsonArray(item.addonsJson);
    const chosenAddons = addons.filter((a: AddonItem) => addonsObj[a.name]);

    let addonText = '';
    if (chosenAddons.length > 0) {
      addonText = `\n➕ *Add-On Tambahan:*\n` + chosenAddons.map((a: AddonItem) => `   • ${a.name} (+${formatIDR(a.price)})`).join('\n');
    }

    const finalPrice = customTotal || item.price;

    const message = `Halo RTS, saya tertarik untuk konsultasi & memesan paket dari *Katalog RTS Website*:

📦 *Paket:* ${item.title}
🏷️ *Kategori:* ${item.category}
⏱️ *Estimasi Waktu:* ${item.estimatedDays}
💰 *Harga Dasar:* ${formatIDR(item.price)} (${item.priceUnit || 'per project'})${addonText}
💵 *Total Estimasi:* ${formatIDR(finalPrice)}

Mohon informasi ketersediaan slot produksi dan langkah selanjutnya. Terima kasih!`;

    return `https://wa.me/${rtsWhatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Generate Multi-Item WhatsApp URL for Wishlist
  const generateMultiItemWhatsAppUrl = () => {
    const rtsWhatsapp = '6281234567890';
    const total = wishlist.reduce((acc, curr) => acc + curr.price, 0);

    const itemsList = wishlist
      .map((item, idx) => `${idx + 1}. *${item.title}* (${item.category}) - ${formatIDR(item.price)}`)
      .join('\n');

    const message = `Halo RTS, saya ingin mengajukan penawaran gabungan untuk beberapa paket dari *Katalog RTS*:

${itemsList}

💵 *Total Estimasi Sementara:* ${formatIDR(total)}

Mohon bantuan untuk review brief gabungan ini dan jadwal konsultasinya. Terima kasih!`;

    return `https://wa.me/${rtsWhatsapp}?text=${encodeURIComponent(message)}`;
  };

  // Toggle wishlist item
  const toggleWishlist = (item: CatalogItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isItemInWishlist = (id: string) => wishlist.some((i) => i.id === id);

  return (
    <section id="catalog" className="py-16 md:py-24 bg-[#F9FAFB] relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0033A0]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FDB913]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0033A0]/10 text-[#0033A0] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>KATALOG LAYANAN & PAKET RTS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 leading-tight">
              Standardized Cinematic Packages
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base font-light mt-3 leading-relaxed">
              Paket produksi film, animasi, motion graphic, dan asset visual siap pakai dengan spesifikasi deliverables jelas, transparansi harga, dan estimasi waktu pengerjaan terstandarisasi.
            </p>
          </div>

          {/* Quick Stats / Right Side Actions */}
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="#calculator"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0033A0] hover:text-white hover:bg-[#0033A0] bg-white border border-[#0033A0]/30 px-4 py-2.5 rounded-xl shadow-sm transition-all duration-300 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FDB913]" />
              <span>Hitung Proyek Kustom</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Filter Controls Bar (Search, Category Tabs, Sort) */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200/80 shadow-sm mb-8 space-y-4">
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari paket (misal: Commercial, Reels, 3D, Drone, Company Profile)..."
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0033A0] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Urutkan:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs sm:text-sm rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#0033A0] cursor-pointer"
              >
                <option value="featured">Paling Direkomendasikan</option>
                <option value="popular">Populer / Best Seller</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-gray-100">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                    isSelected
                      ? 'bg-[#0033A0] text-white shadow-md shadow-[#0033A0]/20 scale-100'
                      : 'bg-gray-50 text-slate-600 hover:bg-gray-100 hover:text-slate-900 border border-gray-150'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FDB913]' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-1">
          <span>
            Menampilkan <strong className="text-slate-700">{filteredItems.length}</strong> paket pilihan
            {selectedCategory !== 'All' ? ` dalam kategori "${selectedCategory}"` : ''}
          </span>
          {wishlist.length > 0 && (
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="text-[#0033A0] font-bold flex items-center space-x-1.5 hover:underline"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{wishlist.length} Paket Disimpan</span>
            </button>
          )}
        </div>

        {/* Catalog Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[520px] bg-white rounded-2xl border border-gray-200 animate-pulse overflow-hidden p-6 space-y-4"
              >
                <div className="h-48 bg-gray-100 rounded-xl" />
                <div className="h-6 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-20 bg-gray-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-16 h-16 bg-blue-50 text-[#0033A0] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">
              Tidak Menemukan Paket
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-light mb-6">
              Tidak ada paket yang cocok dengan filter atau kata kunci "{searchQuery}". Coba gunakan kata kunci lain atau reset filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-[#0033A0] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#002270] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const deliverables = parseJsonArray(item.deliverables);
              const inWishlist = isItemInWishlist(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className="group bg-white rounded-2xl border border-gray-200/90 hover:border-[#0033A0]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
                >
                  {/* Card Media Preview Header */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Badge Overlay */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
                            item.badge.includes('BEST')
                              ? 'bg-[#FDB913] text-slate-900'
                              : item.badge.includes('ENTERPRISE')
                              ? 'bg-[#0033A0] text-white'
                              : item.badge.includes('POPULAR')
                              ? 'bg-purple-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {item.category}
                      </span>
                    </div>

                    {/* Wishlist Quick Toggle Button */}
                    <button
                      onClick={(e) => toggleWishlist(item, e)}
                      title={inWishlist ? 'Hapus dari koleksi brief' : 'Simpan ke koleksi brief'}
                      className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                        inWishlist
                          ? 'bg-[#0033A0] text-white'
                          : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#0033A0]'
                      }`}
                    >
                      <Plus
                        size={16}
                        className={`transition-transform duration-300 ${inWishlist ? 'rotate-45' : ''}`}
                      />
                    </button>

                    {/* Sample Video Pill if Available */}
                    {item.sampleVideoUrl && (
                      <div className="absolute bottom-3 right-3.5 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-slate-200 font-medium border border-white/10">
                        <Play size={10} className="fill-[#FDB913] text-[#FDB913]" />
                        <span>Video Preview</span>
                      </div>
                    )}

                    {/* Estimated Time Strip at Bottom of Media */}
                    <div className="absolute bottom-3 left-3.5 flex items-center space-x-1.5 text-white/90 text-xs font-medium">
                      <Clock size={13} className="text-[#FDB913]" />
                      <span>{item.estimatedDays}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0033A0] transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>

                      {/* Short Desc */}
                      <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed mb-4 line-clamp-2">
                        {item.shortDesc}
                      </p>

                      {/* Key Specs Pills */}
                      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                        <div className="flex items-center space-x-1.5 truncate">
                          <RotateCcw className="w-3.5 h-3.5 text-[#0033A0] shrink-0" />
                          <span className="truncate">{item.revisions || '2x Revisi'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 truncate">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">Lisensi Komersial</span>
                        </div>
                      </div>

                      {/* Deliverables Checklist Snippet */}
                      <div className="space-y-1.5 mb-5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                          Item Termasuk (Deliverables):
                        </span>
                        {deliverables.slice(0, 3).map((d: string, idx: number) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-light">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="truncate">{d}</span>
                          </div>
                        ))}
                        {deliverables.length > 3 && (
                          <span className="text-[11px] text-[#0033A0] font-semibold pl-5 block">
                            +{deliverables.length - 3} item lainnya...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Price & Action Buttons */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-baseline justify-between mb-3.5">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Harga Paket
                          </span>
                          <span className="font-serif text-xl sm:text-2xl font-bold text-[#0033A0]">
                            {formatIDR(item.price)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.priceUnit || 'per project'}
                        </span>
                      </div>

                      {/* Buttons Row */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(item);
                          }}
                          className="w-full bg-slate-100 hover:bg-[#0033A0] text-slate-700 hover:text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 group/btn"
                        >
                          <span>Detail Paket</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>

                        <a
                          href={generateWhatsAppUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Pesan WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner: Custom Project Quote */}
        <div className="mt-14 sm:mt-18 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0033A0] via-[#002880] to-[#1E255C] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-xl space-y-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FDB913] text-slate-950 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Kebutuhan Khusus / Custom Project?</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Butuh Kombinasi Paket atau Estimasi Biaya Spesifik?
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm font-light leading-relaxed">
                Gunakan RTS Smart Pricing Engine untuk menghitung estimasi biaya berdasarkan durasi shooting, pilihan kamera khusus, jumlah kru, dan kompleksitas konsep Anda secara otomatis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center space-x-2 bg-[#FDB913] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Buka AI Smart Pricing</span>
              </a>
              <a
                href="https://wa.me/6281234567890?text=Halo%20RTS,%20saya%20ingin%20konsultasi%20project%20kustom."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Bebas</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PACKAGE DETAIL MODAL (DRAWER / POPUP) */}
      {/* ========================================================================= */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 relative my-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/80 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0033A0] bg-[#0033A0]/10 px-2.5 py-1 rounded-full">
                  {activeModalItem.category}
                </span>
                {activeModalItem.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    {activeModalItem.badge}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-gray-200/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
              
              {/* Media Preview Container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-inner h-60 sm:h-72">
                {activeModalItem.sampleVideoUrl && isVideoPlaying ? (
                  <video
                    src={activeModalItem.sampleVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={activeModalItem.thumbnailUrl}
                      alt={activeModalItem.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                      {activeModalItem.sampleVideoUrl && (
                        <button
                          onClick={() => setIsVideoPlaying(true)}
                          className="p-4 rounded-full bg-[#FDB913] hover:bg-amber-400 text-slate-950 shadow-xl active:scale-95 transition-all flex items-center space-x-2 font-bold text-xs uppercase tracking-wider"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          <span>Tonton Video Contoh</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Title & Full Description */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {activeModalItem.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                  {activeModalItem.fullDesc || activeModalItem.shortDesc}
                </p>
              </div>

              {/* Specs Highlight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Waktu Pengerjaan
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#0033A0]" />
                    <span>{activeModalItem.estimatedDays}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Kebijakan Revisi
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <RotateCcw className="w-3.5 h-3.5 text-[#0033A0]" />
                    <span>{activeModalItem.revisions || '2x Revisi'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Output Resolusi
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Master 4K + Reels</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Lisensi Audio
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Legal Komersial</span>
                  </div>
                </div>
              </div>

              {/* Inclusions / Deliverables Full List */}
              <div>
                <h4 className="font-serif text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deliverables & Inclusions Lengkap</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {parseJsonArray(activeModalItem.deliverables).map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-150 text-xs text-slate-700"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-normal">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gear & Tech Specs Highlights */}
              {activeModalItem.gearSpecs && (
                <div className="bg-[#0033A0]/5 p-4 rounded-2xl border border-[#0033A0]/15">
                  <span className="text-[10px] uppercase font-bold text-[#0033A0] tracking-wider block mb-1">
                    🎥 Standar Peralatan & Spesifikasi Teknis
                  </span>
                  <p className="text-xs text-slate-700 font-light leading-relaxed">
                    {activeModalItem.gearSpecs}
                  </p>
                </div>
              )}

              {/* Interactive Add-On Selector */}
              {parseJsonArray(activeModalItem.addonsJson).length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif text-base font-bold text-slate-900 flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-[#0033A0]" />
                      <span>Opsi Add-On Tambahan (Opsional)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Centang untuk menambah ke pesanan</span>
                  </div>

                  <div className="space-y-2">
                    {parseJsonArray(activeModalItem.addonsJson).map((addon: AddonItem, idx: number) => {
                      const isChecked = !!selectedAddons[addon.name];
                      return (
                        <label
                          key={idx}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue-50/70 border-[#0033A0] text-slate-900 shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-gray-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                setSelectedAddons((prev) => ({
                                  ...prev,
                                  [addon.name]: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 text-[#0033A0] rounded focus:ring-0 cursor-pointer"
                            />
                            <span className="text-xs font-medium">{addon.name}</span>
                          </div>
                          <span className="text-xs font-bold text-[#0033A0]">
                            +{formatIDR(addon.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Action Footer Bar */}
            <div className="p-5 sm:p-6 border-t border-gray-200 bg-white shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Total Estimasi Paket + Add-On
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0033A0]">
                    {formatIDR(modalCalculatedPrice)}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({activeModalItem.priceUnit || 'per project'})
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => toggleWishlist(activeModalItem)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                    isItemInWishlist(activeModalItem.id)
                      ? 'bg-blue-50 border-[#0033A0] text-[#0033A0]'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-slate-700'
                  }`}
                  title="Simpan ke koleksi brief"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>

                <a
                  href={generateWhatsAppUrl(activeModalItem, selectedAddons, modalCalculatedPrice)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING WISHLIST / MULTI-ITEM CONSULTATION TRAY */}
      {/* ========================================================================= */}
      {wishlist.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="flex items-center space-x-3 bg-slate-900 hover:bg-[#0033A0] text-white px-5 py-3.5 rounded-full shadow-2xl border border-white/20 transition-all active:scale-95 group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#FDB913]" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </div>
            <div className="text-left pr-1">
              <span className="text-[10px] uppercase font-semibold text-slate-300 block leading-none">
                Draft Brief Koleksi
              </span>
              <span className="text-xs font-bold text-white">
                {wishlist.length} Paket Disimpan
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Wishlist Slide-Over Drawer */}
      {isWishlistOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fade-in"
          onClick={() => setIsWishlistOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-hidden animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#0033A0]" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Koleksi Paket Brief ({wishlist.length})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body (Items List) */}
            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Belum ada paket yang disimpan dalam koleksi brief.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#0033A0] uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-900">
                        {formatIDR(item.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Bottom (Total & Send WA CTA) */}
            {wishlist.length > 0 && (
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Estimasi Subtotal:</span>
                  <span className="font-serif text-xl font-bold text-[#0033A0]">
                    {formatIDR(wishlist.reduce((acc, curr) => acc + curr.price, 0))}
                  </span>
                </div>
                <a
                  href={generateMultiItemWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Brief Koleksi ke WhatsApp</span>
                </a>
                <button
                  onClick={() => setWishlist([])}
                  className="w-full text-[11px] text-slate-400 hover:text-red-500 transition-colors text-center"
                >
                  Kosongkan Koleksi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
