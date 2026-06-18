import React, { useState } from 'react';
import {
  Camera,
  Heart,
  Share2,
  Download,
  Filter,
  Grid,
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  room: string;
  style: string;
  products: string[];
  likes: number;
  isLiked: boolean;
}

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Rooms' },
    { id: 'living-room', name: 'Living Room' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'dining', name: 'Dining Room' },
    { id: 'office', name: 'Home Office' },
    { id: 'outdoor', name: 'Outdoor' }
  ];

  const galleryImages: GalleryImage[] = [
    {
      id: '1',
      src: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Modern Scandinavian Living Room',
      category: 'living-room',
      room: 'Living Room',
      style: 'Scandinavian',
      products: ['Premium Scandinavian Sofa', 'Glass Coffee Table', 'Modern Floor Lamp'],
      likes: 234,
      isLiked: false
    },
    {
      id: '2',
      src: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Elegant Dining Space',
      category: 'dining',
      room: 'Dining Room',
      style: 'Contemporary',
      products: ['Oak Dining Table', 'Upholstered Dining Chairs', 'Crystal Chandelier'],
      likes: 189,
      isLiked: true
    },
    {
      id: '3',
      src: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Luxury Master Bedroom',
      category: 'bedroom',
      room: 'Bedroom',
      style: 'Luxury',
      products: ['King Platform Bed', 'Velvet Accent Chair', 'Marble Nightstands'],
      likes: 312,
      isLiked: false
    },
    {
      id: '4',
      src: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Executive Home Office',
      category: 'office',
      room: 'Home Office',
      style: 'Traditional',
      products: ['Executive Desk', 'Leather Office Chair', 'Built-in Bookshelf'],
      likes: 156,
      isLiked: false
    },
    {
      id: '5',
      src: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Cozy Reading Nook',
      category: 'living-room',
      room: 'Living Room',
      style: 'Cozy',
      products: ['Reading Chair', 'Side Table', 'Floor Lamp'],
      likes: 98,
      isLiked: true
    },
    {
      id: '6',
      src: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Minimalist Bedroom',
      category: 'bedroom',
      room: 'Bedroom',
      style: 'Minimalist',
      products: ['Platform Bed', 'Floating Nightstands', 'Pendant Lights'],
      likes: 267,
      isLiked: false
    }
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (imageId: string) => {
    // Handle like toggle
    console.log('Toggle like for image:', imageId);
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
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
      {/* Hero Section */}
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs, styles, or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none bg-white shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
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

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {filteredImages.length === 0 ? (
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
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(image.id);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors duration-200"
                        >
                          <Heart className={`w-5 h-5 ${image.isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors duration-200">
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors duration-200">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Style Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        {image.style}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-montserrat">
                      {image.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 font-playfair">
                      {image.room} • {image.products.length} Products
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-600">{image.likes}</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
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

            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
              <h3 className="text-2xl font-bold text-white mb-2 font-montserrat">
                {selectedImage.title}
              </h3>
              <p className="text-white/90 mb-4 font-playfair">
                {selectedImage.room} • {selectedImage.style} Style
              </p>
              
              {/* Featured Products */}
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">Featured Products:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.products.map((product, index) => (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>{selectedImage.likes}</span>
                </button>
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
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
