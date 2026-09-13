import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink, Search, ShoppingBag, Palette, Briefcase, Loader2 } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { useGetProductsQuery, Product } from '../../store/api/productsApi';
import { useGetGalleryItemsQuery, GalleryItem } from '../../store/api/galleryApi';
import { formatCurrency } from '../../utils/formatters';

type DisplayItem = {
  id: string;
  src: string;
  title: string;
  category: string;
  type: 'product' | 'inspiration' | 'project';
  price?: number;
  originalPrice?: number;
  productId?: string;
  clientName?: string;
  location?: string;
  description?: string;
};

const ITEMS_PER_PAGE = 18;

const Gallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'all') as 'all' | 'products' | 'inspiration' | 'projects';
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [selectedImage, setSelectedImage] = useState<DisplayItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ limit: 100 });
  const { data: galleryData, isLoading: galleryLoading } = useGetGalleryItemsQuery({ limit: 200 });
  const isLoading = productsLoading || galleryLoading;

  const setParam = useCallback((key: string, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all' && value !== '') next.set(key, value);
      else next.delete(key);
      return next;
    });
    setVisibleCount(ITEMS_PER_PAGE);
  }, [setSearchParams]);

  const allItems = useMemo<DisplayItem[]>(() => {
    const items: DisplayItem[] = [];

    if (productsData?.data?.items) {
      productsData.data.items.forEach((product: Product) => {
        product.images.forEach((img, idx) => {
          items.push({
            id: `p-${product.id || (product as any)._id}-${idx}`,
            src: img,
            title: idx === 0 ? product.name : `${product.name} - View ${idx + 1}`,
            category: product.category,
            type: 'product',
            price: product.basePrice,
            originalPrice: product.originalPrice,
            productId: product.id || (product as any)._id,
          });
        });
      });
    }

    if (galleryData?.data?.items) {
      galleryData.data.items.forEach((item: GalleryItem) => {
        item.images.forEach((img, idx) => {
          items.push({
            id: `g-${item._id}-${idx}`,
            src: img,
            title: idx === 0 ? item.title : `${item.title} - ${idx + 1}`,
            category: item.category,
            type: item.type,
            clientName: item.clientName,
            location: item.location,
            description: item.description,
          });
        });
      });
    }

    return items;
  }, [productsData, galleryData]);

  const filteredItems = useMemo(() => allItems.filter(item => {
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'products' && item.type === 'product') ||
      (activeTab === 'inspiration' && item.type === 'inspiration') ||
      (activeTab === 'projects' && item.type === 'project');
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  }), [allItems, activeTab, selectedCategory, searchQuery]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allItems.map(i => i.category)));
    return ['all', ...unique];
  }, [allItems]);

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(prev => prev + ITEMS_PER_PAGE); },
      { rootMargin: '200px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, filteredItems.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!selectedImage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [selectedImage, filteredItems]);

  const navigateImage = useCallback((dir: 'prev' | 'next') => {
    setSelectedImage(prev => {
      if (!prev) return null;
      const idx = filteredItems.findIndex(i => i.id === prev.id);
      if (idx === -1) return prev;
      const newIdx = dir === 'prev'
        ? idx > 0 ? idx - 1 : filteredItems.length - 1
        : idx < filteredItems.length - 1 ? idx + 1 : 0;
      return filteredItems[newIdx];
    });
  }, [filteredItems]);

  // Touch swipe in lightbox
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigateImage(diff > 0 ? 'next' : 'prev');
  };

  const tabs = [
    { key: 'all' as const, label: 'All', icon: null },
    { key: 'products' as const, label: 'Products', icon: ShoppingBag },
    { key: 'inspiration' as const, label: 'Inspiration', icon: Palette },
    { key: 'projects' as const, label: 'Projects', icon: Briefcase },
  ];

  const ImageCard = ({ item, idx }: { item: DisplayItem; idx: number }) => {
    const tall = idx % 5 === 0 || idx % 7 === 3;
    return (
      <div className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid mb-3 sm:mb-4" onClick={() => setSelectedImage(item)}>
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${tall ? 'h-72 sm:h-96' : 'h-48 sm:h-64'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className={`absolute top-2 left-2 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
          item.type === 'product' ? 'bg-amber-500 text-white' :
          item.type === 'project' ? 'bg-blue-500 text-white' :
          'bg-green-500 text-white'
        }`}>
          {item.type === 'product' ? 'Shop' : item.type === 'project' ? 'Project' : 'Inspo'}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white font-bold text-sm truncate">{item.title}</p>
          {item.price ? (
            <span className="text-amber-400 font-bold text-sm">{formatCurrency(item.price)}</span>
          ) : item.clientName ? (
            <span className="text-white/70 text-xs">{item.clientName}</span>
          ) : (
            <span className="text-white/70 text-xs capitalize">{item.category.replace('-', ' ')}</span>
          )}
        </div>

        {item.type === 'product' && (
          <Link
            to={`/product/${item.productId}`}
            onClick={e => e.stopPropagation()}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-amber-600"
          >
            Buy Now
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead title="Gallery & Inspiration | LuxeHome" description="Explore our gallery of premium furniture, room designs, and completed projects." />

      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 font-montserrat">Gallery</h1>
          <p className="text-gray-600 mb-5 text-sm sm:text-base">Products, inspiration, and completed projects</p>

          <div className="max-w-md mx-auto relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" placeholder="Search..." value={searchQuery}
              onChange={e => setParam('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none bg-white shadow-sm text-sm"
            />
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setParam('tab', tab.key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab.key ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setParam('category', cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat ? 'bg-gray-900 text-white' : 'bg-white/80 text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat === 'all' ? 'All' : cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="container mx-auto px-3 sm:px-4">
          {isLoading ? (
            <div className="columns-2 sm:columns-3 gap-3 sm:gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`bg-gray-200 rounded-2xl animate-pulse mb-3 sm:mb-4 break-inside-avoid ${i % 3 === 0 ? 'h-72 sm:h-96' : 'h-48 sm:h-64'}`} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No items found.</p>
              {(activeTab !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                <button onClick={() => setSearchParams({})} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 gap-3 sm:gap-4">
              {visibleItems.map((item, i) => (
                <ImageCard key={item.id} item={item} idx={i} />
              ))}
            </div>
          )}

          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          )}

          {!isLoading && filteredItems.length > 0 && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Showing {visibleItems.length} of {filteredItems.length}
            </p>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"><X className="w-7 h-7" /></button>
          <button onClick={e => { e.stopPropagation(); navigateImage('prev'); }} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-10"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={e => { e.stopPropagation(); navigateImage('next'); }} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-10"><ChevronRight className="w-8 h-8" /></button>

          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} className="w-full max-h-[70vh] object-contain rounded-xl" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{selectedImage.title}</h3>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedImage.type === 'product' ? 'bg-amber-500/20 text-amber-400' :
                    selectedImage.type === 'project' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>{selectedImage.type}</span>
                  {selectedImage.price && <span className="text-amber-400 font-bold">{formatCurrency(selectedImage.price)}</span>}
                  {selectedImage.originalPrice && selectedImage.originalPrice > (selectedImage.price || 0) && (
                    <span className="text-white/40 line-through text-sm">{formatCurrency(selectedImage.originalPrice)}</span>
                  )}
                  {selectedImage.clientName && <span className="text-white/60 text-sm">{selectedImage.clientName}{selectedImage.location ? ` - ${selectedImage.location}` : ''}</span>}
                  <span className="text-white/40 text-sm capitalize">{selectedImage.category.replace('-', ' ')}</span>
                </div>
                {selectedImage.description && <p className="text-white/60 text-sm mt-2 line-clamp-2">{selectedImage.description}</p>}
              </div>
              {selectedImage.productId && (
                <Link
                  to={`/product/${selectedImage.productId}`}
                  className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors font-semibold text-sm flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" /> Buy Now
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
