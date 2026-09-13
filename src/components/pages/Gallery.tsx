import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink, Search, ShoppingBag, Palette, Briefcase } from 'lucide-react';
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

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'inspiration' | 'projects'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<DisplayItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ limit: 50 });
  const { data: galleryData, isLoading: galleryLoading } = useGetGalleryItemsQuery({ limit: 100 });

  const isLoading = productsLoading || galleryLoading;

  const allItems = useMemo<DisplayItem[]>(() => {
    const items: DisplayItem[] = [];

    if (productsData?.data?.items) {
      productsData.data.items.forEach((product: Product) => {
        product.images.forEach((img, idx) => {
          items.push({
            id: `product-${product.id}-${idx}`,
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
            id: `gallery-${item._id}-${idx}`,
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

  const filteredItems = allItems.filter((item) => {
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'products' && item.type === 'product') ||
      (activeTab === 'inspiration' && item.type === 'inspiration') ||
      (activeTab === 'projects' && item.type === 'project');
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allItems.map(i => i.category)));
    return ['all', ...unique];
  }, [allItems]);

  const navigateImage = (dir: 'prev' | 'next') => {
    if (!selectedImage) return;
    const idx = filteredItems.findIndex(i => i.id === selectedImage.id);
    const newIdx = dir === 'prev'
      ? idx > 0 ? idx - 1 : filteredItems.length - 1
      : idx < filteredItems.length - 1 ? idx + 1 : 0;
    setSelectedImage(filteredItems[newIdx]);
  };

  const tabs = [
    { key: 'all' as const, label: 'All', icon: null, count: allItems.length },
    { key: 'products' as const, label: 'Products', icon: ShoppingBag, count: allItems.filter(i => i.type === 'product').length },
    { key: 'inspiration' as const, label: 'Inspiration', icon: Palette, count: allItems.filter(i => i.type === 'inspiration').length },
    { key: 'projects' as const, label: 'Projects', icon: Briefcase, count: allItems.filter(i => i.type === 'project').length },
  ];

  const col1 = filteredItems.filter((_, i) => i % 3 === 0);
  const col2 = filteredItems.filter((_, i) => i % 3 === 1);
  const col3 = filteredItems.filter((_, i) => i % 3 === 2);

  const ImageCard = ({ item, tall }: { item: DisplayItem; tall?: boolean }) => (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer mb-3 sm:mb-4"
      onClick={() => setSelectedImage(item)}
    >
      <img
        src={item.src}
        alt={item.title}
        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${tall ? 'h-72 sm:h-96' : 'h-48 sm:h-64'}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-2 left-2">
        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
          item.type === 'product' ? 'bg-amber-500 text-white' :
          item.type === 'project' ? 'bg-blue-500 text-white' :
          'bg-green-500 text-white'
        }`}>
          {item.type === 'product' ? 'Shop' : item.type === 'project' ? 'Project' : 'Inspo'}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-bold text-sm truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          {item.price ? (
            <span className="text-amber-400 font-bold text-sm">{formatCurrency(item.price)}</span>
          ) : item.clientName ? (
            <span className="text-white/70 text-xs">{item.clientName}{item.location ? `, ${item.location}` : ''}</span>
          ) : (
            <span className="text-white/70 text-xs capitalize">{item.category.replace('-', ' ')}</span>
          )}
        </div>
      </div>

      {item.type === 'product' && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/product/${item.productId}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-amber-600 transition-colors"
          >
            Buy Now
          </Link>
        </div>
      )}
    </div>
  );

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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none bg-white shadow-sm text-sm"
            />
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab.key ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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
                <div key={i} className={`bg-gray-200 rounded-2xl animate-pulse mb-3 sm:mb-4 ${i % 3 === 0 ? 'h-72 sm:h-96' : 'h-48 sm:h-64'}`} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No items found.</p>
            </div>
          ) : (
            <>
              <div className="sm:hidden columns-2 gap-3">
                {filteredItems.map((item, i) => <ImageCard key={item.id} item={item} tall={i % 5 === 0} />)}
              </div>
              <div className="hidden sm:flex gap-4">
                <div className="flex-1">{col1.map((item, i) => <ImageCard key={item.id} item={item} tall={i % 3 === 0} />)}</div>
                <div className="flex-1">{col2.map((item, i) => <ImageCard key={item.id} item={item} tall={i % 3 === 1} />)}</div>
                <div className="flex-1">{col3.map((item, i) => <ImageCard key={item.id} item={item} tall={i % 3 === 2} />)}</div>
              </div>
            </>
          )}
          <p className="text-center text-sm text-gray-400 mt-6">{filteredItems.length} items</p>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"><X className="w-7 h-7" /></button>
          <button onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-10"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={(e) => { e.stopPropagation(); navigateImage('next'); }} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-10"><ChevronRight className="w-8 h-8" /></button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} className="w-full max-h-[70vh] object-contain rounded-xl" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-lg">{selectedImage.title}</h3>
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
                {selectedImage.description && <p className="text-white/60 text-sm mt-2 max-w-xl">{selectedImage.description}</p>}
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
