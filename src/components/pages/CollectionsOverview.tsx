import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Eye, Sofa, Bed, ChefHat, Briefcase, Home, Palette } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  route: string;
  icon: React.ReactNode;
  featured: boolean;
  tags: string[];
}

const CollectionsOverview: React.FC = () => {
  const collections: Collection[] = [
    {
      id: 'living-room',
      name: 'Living Room',
      description: 'Transform your living space with our premium sofas, chairs, and coffee tables designed for comfort and style.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      productCount: 156,
      route: '/collections/living-room',
      icon: <Sofa className="w-6 h-6" />,
      featured: true,
      tags: ['Sofas', 'Chairs', 'Coffee Tables', 'TV Units']
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      description: 'Create your perfect sanctuary with our luxurious beds, wardrobes, and nightstands for restful nights.',
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800',
      productCount: 124,
      route: '/collections/bedroom',
      icon: <Bed className="w-6 h-6" />,
      featured: true,
      tags: ['Beds', 'Wardrobes', 'Nightstands', 'Dressers']
    },
    {
      id: 'dining-room',
      name: 'Dining Room',
      description: 'Gather in style with our elegant dining tables, chairs, and storage solutions for memorable meals.',
      image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
      productCount: 89,
      route: '/collections/dining-room',
      icon: <ChefHat className="w-6 h-6" />,
      featured: true,
      tags: ['Dining Tables', 'Dining Chairs', 'Buffets', 'Bar Stools']
    },
    {
      id: 'office',
      name: 'Home Office',
      description: 'Boost productivity with our ergonomic desks, chairs, and storage solutions for your workspace.',
      image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
      productCount: 67,
      route: '/collections/office',
      icon: <Briefcase className="w-6 h-6" />,
      featured: false,
      tags: ['Desks', 'Office Chairs', 'Bookcases', 'Filing Cabinets']
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      description: 'Extend your living space outdoors with weather-resistant furniture for patios and gardens.',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      productCount: 45,
      route: '/collections/outdoor',
      icon: <Home className="w-6 h-6" />,
      featured: false,
      tags: ['Patio Sets', 'Outdoor Sofas', 'Garden Chairs', 'Umbrellas']
    },
    {
      id: 'decor',
      name: 'Decor & Accessories',
      description: 'Complete your space with our curated selection of lighting, rugs, and decorative accessories.',
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      productCount: 203,
      route: '/collections/decor',
      icon: <Palette className="w-6 h-6" />,
      featured: false,
      tags: ['Lighting', 'Rugs', 'Mirrors', 'Wall Art']
    }
  ];

  const featuredCollections = collections.filter(collection => collection.featured);
  const otherCollections = collections.filter(collection => !collection.featured);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      <SEOHead
        title="Collections | LuxeHome"
        description="Explore our curated furniture collections for every room."
        keywords="furniture collections, living room, bedroom, dining room, office furniture"
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-montserrat">
              Our Collections
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 font-playfair">
              Discover curated furniture collections designed to transform every room in your home
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <span>Handpicked Designs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-amber-400" />
                <span>Complete Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg font-playfair">
            Our most popular furniture collections for every lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {featuredCollections.map((collection, index) => (
            <Link
              key={collection.id}
              to={collection.route}
              className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <div className={`relative ${index === 0 ? 'h-96 lg:h-full' : 'h-80'}`}>
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-amber-600 p-2 rounded-lg">
                      {collection.icon}
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {collection.productCount} Products
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2 font-montserrat">
                    {collection.name}
                  </h3>
                  
                  <p className="text-gray-200 mb-4 font-playfair">
                    {collection.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {collection.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Other Collections */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            More Collections
          </h2>
          <p className="text-gray-600 text-lg font-playfair">
            Specialized collections for every space and need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherCollections.map((collection) => (
            <Link
              key={collection.id}
              to={collection.route}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
            >
              <div className="relative h-48">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                    {collection.icon}
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {collection.productCount}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-montserrat">
                  {collection.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 font-playfair">
                  {collection.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {collection.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold">View Collection</span>
                  <ArrowRight className="w-5 h-5 text-amber-600 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 text-lg mb-8 font-playfair">
            Browse our complete product catalog or get in touch with our design experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors duration-200"
            >
              Browse All Products
            </Link>
            <Link
              to="/contact"
              className="border border-amber-600 text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-amber-600 hover:text-white transition-colors duration-200"
            >
              Contact Design Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsOverview;
