import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Share2,
  Filter,
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
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

  const { data, isLoading } = useGetProductsQuery({ limit: 12 });

  const galleryItems = useMemo<GalleryItem[]>(() => {
    if (!data?.data?.items?.length) return [];

    return data.data.items
      .filter((product: Product) => product.images.length > 0)
      .map((product: Product) => ({
        id: product.id,
        src: product.images[0],
        title: product.name,
        category: product.category,
        price: product.basePrice,
        originalPrice: product.originalPrice,
      }));
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
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (image: GalleryItem) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;

    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="Gallery & Inspiration | LuxeHome"
        description="Explore our gallery of beautifully furnished spaces for design inspiration."
        keywords="furniture gallery, interior design inspiration, home decor ideas"
      />

      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
            Design Gallery
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair max-w-3xl mx-auto">
            Get inspired by beautiful room designs featuring our premium furniture collections
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none bg-white shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900 shadow-md hover:shadow-lg'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-600">Try adjusting your search or browse different categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group hover:scale-105 transform-gpu cursor-pointer"
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors duration-200">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors duration-200">
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        {image.category.charAt(0).toUpperCase() + image.category.slice(1).replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-montserrat">
                      {image.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 font-playfair">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1).replace(/-/g, ' ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-amber-600">{formatCurrency(image.price)}</span>
                        {image.originalPrice && image.originalPrice > image.price && (
                          <span className="text-sm text-gray-400 line-through">{formatCurrency(image.originalPrice)}</span>
                        )}
                      </div>
                      <Link
                        to={`/product/${image.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
              <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">
                {selectedImage.title}
              </h3>
              <p className="text-white/90 mb-4 font-playfair">
                {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1).replace(/-/g, ' ')}
              </p>

              <div className="mb-4">
                <span className="text-2xl font-bold text-amber-400">{formatCurrency(selectedImage.price)}</span>
                {selectedImage.originalPrice && selectedImage.originalPrice > selectedImage.price && (
                  <span className="text-lg text-white/50 line-through ml-3">{formatCurrency(selectedImage.originalPrice)}</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to={`/product/${selectedImage.id}`}
                  className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Product</span>
                </Link>
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl hover:bg-white/30 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
