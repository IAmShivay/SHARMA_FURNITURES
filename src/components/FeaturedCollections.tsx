import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Collection } from '../types';

const FeaturedCollections: React.FC = () => {
  const collections: Collection[] = [
    {
      id: '1',
      name: 'Modern Living',
      description: 'Contemporary furniture for today\'s lifestyle',
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 124
    },
    {
      id: '2',
      name: 'Scandinavian Style',
      description: 'Minimalist Nordic design philosophy',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 89
    },
    {
      id: '3',
      name: 'Luxury Bedroom',
      description: 'Premium comfort and elegant design',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 156
    },
    {
      id: '4',
      name: 'Office Essentials',
      description: 'Productive and stylish workspace solutions',
      image: 'https://images.pexels.com/photos/1571474/pexels-photo-1571474.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 67
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Featured Collections
          </h2>
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Discover our carefully curated furniture collections designed to transform your space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {collection.name}
                    </h3>
                    <p className="text-gray-200 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        {collection.productCount} products
                      </span>
                      <div className="flex items-center space-x-2 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-medium">Shop Now</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;