'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Film, Calendar, Eye } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  category: string;
  year: string;
  featured: boolean;
}

export default function PortfolioGrid() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Film Production', 'Animation', 'Motion Graphic', 'Creative Visual'];

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          setItems(data);
          setFilteredItems(data);
        }
      } catch (err) {
        console.error('Error fetching portfolios:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolios();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === category));
    }
  };

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <section id="portfolio" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#0033A0] font-bold mb-3 block">
              PORTFOLIO SHOWCASE
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-slate-800">
              Selected Works
            </h2>
          </div>

          {/* Categories Filters */}
          <div className="flex flex-wrap gap-2 mt-8 md:mt-0 max-w-full overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[11px] uppercase tracking-widest font-semibold px-5 py-2.5 rounded transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'bg-[#0033A0] text-white border-[#0033A0] hover:bg-[#002D9C]'
                    : 'bg-transparent text-slate-500 border-gray-200 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {cat === 'All' ? 'SEMUA' : cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-video bg-gray-100 animate-pulse rounded border border-gray-200" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 rounded bg-gray-50">
            <p className="text-slate-400 tracking-wider">Belum ada karya untuk kategori ini.</p>
          </div>
        ) : (
          /* Portfolio Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filteredItems.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onOpenModal={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cinematic Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          {/* Fixed Screen-level Close Button (Always visible regardless of modal scroll height) */}
          <button
            onClick={() => setSelectedProject(null)}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] p-3 rounded-full bg-slate-900/80 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95 group"
            aria-label="Tutup modal"
            title="Tutup (Esc)"
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Container */}
          <div
            className="relative w-full max-w-6xl max-h-[90vh] md:max-h-[85vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player Section */}
            <div className="w-full md:w-3/5 lg:w-2/3 bg-black relative aspect-video md:aspect-auto flex-shrink-0 min-h-[240px] md:min-h-[420px] flex items-center justify-center">
              <iframe
                src={selectedProject.videoUrl.includes('mixkit.co') 
                  ? undefined 
                  : selectedProject.videoUrl.includes('youtube.com') || selectedProject.videoUrl.includes('youtu.be')
                    ? `https://www.youtube.com/embed/${selectedProject.videoUrl.split('v=')[1]?.split('&')[0] || selectedProject.videoUrl.split('/').pop()}?autoplay=1`
                    : selectedProject.videoUrl
                }
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={selectedProject.title}
              />
              {selectedProject.videoUrl.includes('mixkit.co') && (
                <video
                  src={selectedProject.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Project Info Panel */}
            <div className="w-full md:w-2/5 lg:w-1/3 p-6 md:p-8 overflow-y-auto flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 bg-white text-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-semibold tracking-wider uppercase">
                  <span className="flex items-center space-x-1.5 bg-[#0033A0]/10 text-[#0033A0] px-3 py-1 rounded-full shadow-sm">
                    <Film className="w-3.5 h-3.5" />
                    <span>{selectedProject.category}</span>
                  </span>
                  <span className="flex items-center space-x-1.5 bg-gray-100 text-slate-500 px-3 py-1 rounded-full border border-gray-200">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedProject.year}</span>
                  </span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
                  {selectedProject.title}
                </h3>
                
                <div className="w-12 h-1 bg-[#0033A0] rounded mb-5" />

                <p className="text-slate-600 leading-relaxed text-sm font-light whitespace-pre-line">
                  {selectedProject.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium tracking-wide text-slate-400">Rencana Tuhan Studio</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* Individual Card Component to handle hover autoplay */
function PortfolioCard({
  item,
  onOpenModal,
}: {
  item: PortfolioItem;
  onOpenModal: (item: PortfolioItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (hovered) {
        // Play video
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log('Video autoplay prevented:', error);
          });
        }
      } else {
        // Pause and reset
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [hovered]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal(item)}
      className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:border-[#0033A0]/30 transition-all duration-500 flex flex-col"
    >
      {/* Media Box */}
      <div className="aspect-video w-full overflow-hidden relative bg-black">
        {/* Placeholder / Thumbnail Image */}
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            hovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Hover Autoplay Video Snippet */}
        {item.videoUrl && (
          <video
            ref={videoRef}
            src={item.videoUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-4 rounded-full bg-[#0033A0] text-white shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Eye size={24} />
          </div>
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] tracking-widest text-white/80 uppercase font-semibold">
          {item.year}
        </div>
      </div>

      {/* Info details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] tracking-widest text-[#0033A0] uppercase font-bold block mb-2">
            {item.category}
          </span>
          <h4 className="font-serif text-lg font-bold text-slate-800 group-hover:text-[#0033A0] transition-colors duration-300 line-clamp-1">
            {item.title}
          </h4>
          <p className="text-slate-500 text-xs mt-2 font-light line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}
