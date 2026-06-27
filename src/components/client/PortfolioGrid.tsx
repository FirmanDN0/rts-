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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xl animate-scale-in my-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black relative">
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

            {/* Project Info */}
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-semibold text-[#0033A0] tracking-widest uppercase">
                <span className="flex items-center space-x-1.5 bg-[#0033A0]/10 px-2.5 py-1 rounded">
                  <Film className="w-3.5 h-3.5" />
                  <span>{selectedProject.category}</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-gray-100 px-2.5 py-1 rounded text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedProject.year}</span>
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base font-light">
                {selectedProject.description}
              </p>
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
