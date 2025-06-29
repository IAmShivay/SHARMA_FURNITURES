import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Collection } from '../../types';

const CollectionsSection: React.FC = () => {
  const collections: Collection[] = [
    {
      id: '1',
      name: 'Living Room',
      description: 'Contemporary pieces that define today\'s sophisticated lifestyle',
      image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 124,
      slug: 'living-room'
    },
    {
      id: '2',
      name: 'Bedroom',
      description: 'Minimalist Nordic design philosophy meets functional beauty',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 89,
      slug: 'bedroom'
    },
    {
      id: '3',
      name: 'Dining Room',
      description: 'Premium comfort and elegant design for your personal sanctuary',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 156,
      slug: 'dining'
    },
    {
      id: '4',
      name: 'Home Office',
      description: 'Productive and stylish workspace solutions for professionals',
      image: 'https://images.pexels.com/photos/1571474/pexels-photo-1571474.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      productCount: 67,
      slug: 'office'
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-amber-600" />
            <span className="text-amber-600 font-medium font-montserrat">Curated Collections</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
            Signature Collections
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-playfair">
            Each collection tells a story of craftsmanship, design excellence, and the art of living beautifully
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className={`group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] block ${
                index % 2 === 0 ? 'md:translate-y-8' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
                {/* Collection Image */}
                <div className="relative h-96 lg:h-[500px] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-semibold text-gray-900 font-montserrat">
                      {collection.productCount} pieces
                    </span>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-montserrat">
                      {collection.name}
                    </h3>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed font-playfair">
                      {collection.description}
                    </p>
                    
                    {/* CTA Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <span className="text-lg font-semibold font-montserrat">Explore Collection</span>
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group font-montserrat"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;