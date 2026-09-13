import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { useGetProductsQuery, Product } from '../../store/api/productsApi';
import { formatCurrency } from '../../utils/formatters';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
}

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useGetProductsQuery({ limit: 50 });

  const galleryItems = useMemo<GalleryItem[]>(() => {
    if (!data?.data?.items?.length) return [];

    const items: GalleryItem[] = [];
    data.data.items.forEach((product: Product) => {
      product.images.forEach((img, idx) => {
        items.push({
          id: `${product.id}-${idx}`,
          src: img,
          title: idx === 0 ? product.name : `${product.name} - View ${idx + 1}`,
          category: product.category,
          price: product.basePrice,
          originalPrice: product.originalPrice,
        });
      });
    });
    return items;
  }, [data]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(galleryItems.map((item) => item.category)));
    return [
      { id: 'all', name: 'All' },
      ...uniqueCategories.map((cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
      })),
    ];
  }, [galleryItems]);

  const filteredImages = galleryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const newIndex =
      direction === 'prev'
        ? currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
        : currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredImages[newIndex]);
  };

  const col1 = filteredImages.filter((_, i) => i % 3 === 0);
  const col2 = filteredImages.filter((_, i) => i % 3 === 1);
  const col3 = filteredImages.filter((_, i) => i % 3 === 2);

  const ImageCard = ({ item, tall }: { item: GalleryItem; tall?: boolean }) => (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer mb-3 sm:mb-4"
      onClick={() => setSelectedImage(item)}
    >
      <img
        src={item.src}
        alt={item.title}
        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
          tall ? 'h-72 sm:h-96' : 'h-48 sm:h-64'
        }`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-bold text-sm sm:text-base truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-amber-400 font-bold text-sm">{formatCurrency(item.price)}</span>
          <span className="text-white/70 text-xs capitalize">{item.category}</span>
        </div>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/product/${item.id.split('-')[0]}`}
          onClick={(e) => e.stopPropagation()}
          className="bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-white transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="Gallery & Inspiration | LuxeHome"
        description="Explore our gallery of premium furniture for design inspiration."
      />

      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 font-montserrat">
            Design Gallery
          </h1>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Get inspired by our premium furniture collections
          </p>

          <div className="max-w-md mx-auto relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none bg-white shadow-sm text-sm"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:text-gray-900 shadow-sm hover:shadow-md'
                }`}
              >
                {cat.name}
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
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No images found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              {/* Mobile: 2 columns masonry */}
              <div className="sm:hidden columns-2 gap-3">
                {filteredImages.map((item, i) => (
                  <ImageCard key={item.id} item={item} tall={i % 5 === 0} />
                ))}
              </div>

              {/* Desktop: 3 columns masonry */}
              <div className="hidden sm:flex gap-4">
                <div className="flex-1">
                  {col1.map((item, i) => (
                    <ImageCard key={item.id} item={item} tall={i % 3 === 0} />
                  ))}
                </div>
                <div className="flex-1">
                  {col2.map((item, i) => (
                    <ImageCard key={item.id} item={item} tall={i % 3 === 1} />
                  ))}
                </div>
                <div className="flex-1">
                  {col3.map((item, i) => (
                    <ImageCard key={item.id} item={item} tall={i % 3 === 2} />
                  ))}
                </div>
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-400 mt-8">
            {filteredImages.length} images
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
          >
            <X className="w-7 h-7" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{selectedImage.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-amber-400 font-bold">{formatCurrency(selectedImage.price)}</span>
                  {selectedImage.originalPrice && selectedImage.originalPrice > selectedImage.price && (
                    <span className="text-white/40 line-through text-sm">{formatCurrency(selectedImage.originalPrice)}</span>
                  )}
                  <span className="text-white/50 text-sm capitalize">{selectedImage.category}</span>
                </div>
              </div>
              <Link
                to={`/product/${selectedImage.id.split('-')[0]}`}
                className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors font-semibold text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
