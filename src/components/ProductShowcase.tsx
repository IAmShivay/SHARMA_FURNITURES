import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';

const ProductShowcase: React.FC = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: '1',
      name: 'Velvet Accent Chair',
      price: 899,
      originalPrice: 1199,
      images: [
        'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      category: 'Living Room',
      description: 'Luxurious velvet accent chair perfect for any modern living space',
      specifications: { Material: 'Premium Velvet', Dimensions: '32"W x 30"D x 35"H' },
      inStock: true,
      rating: 4.8,
      reviewCount: 124,
      colors: ['Navy', 'Emerald', 'Blush'],
      tags: ['bestseller', 'sale'],
      customizationSections: [
        {
          id: 'color',
          title: 'Choose Color',
          type: 'color',
          required: true,
          options: [
            { id: 'navy', name: 'Navy Blue', price: 0, image: 'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 'emerald', name: 'Emerald Green', price: 50, image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600' },
            { id: 'blush', name: 'Blush Pink', price: 50, image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600' }
          ]
        },
        {
          id: 'material',
          title: 'Material Upgrade',
          type: 'radio',
          required: false,
          options: [
            { id: 'standard', name: 'Standard Velvet', price: 0 },
            { id: 'premium', name: 'Premium Velvet', price: 200 },
            { id: 'luxury', name: 'Luxury Italian Velvet', price: 400 }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Scandinavian Dining Table',
      price: 1299,
      images: [
        'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      category: 'Dining',
      description: 'Minimalist solid wood dining table with clean lines',
      specifications: { Material: 'Solid Oak', Dimensions: '72"L x 36"W x 30"H' },
      inStock: true,
      rating: 4.9,
      reviewCount: 89,
      materials: ['Oak', 'Walnut'],
      tags: ['new', 'eco-friendly'],
      customizationSections: [
        {
          id: 'wood',
          title: 'Wood Type',
          type: 'radio',
          required: true,
          options: [
            { id: 'oak', name: 'Natural Oak', price: 0 },
            { id: 'walnut', name: 'Rich Walnut', price: 300 },
            { id: 'cherry', name: 'Premium Cherry', price: 500 }
          ]
        },
        {
          id: 'size',
          title: 'Table Size',
          type: 'radio',
          required: true,
          options: [
            { id: 'standard', name: '72" x 36"', price: 0 },
            { id: 'large', name: '84" x 42"', price: 400 },
            { id: 'xl', name: '96" x 48"', price: 800 }
          ]
        },
        {
          id: 'assembly',
          title: 'Assembly Service',
          type: 'checkbox',
          required: false,
          options: [
            { id: 'assembly', name: 'Professional Assembly', price: 150 }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Modern Bed Frame',
      price: 1899,
      images: [
        'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      category: 'Bedroom',
      description: 'Contemporary platform bed with built-in nightstands',
      specifications: { Material: 'Engineered Wood', Dimensions: 'Queen Size' },
      inStock: true,
      rating: 4.7,
      reviewCount: 156,
      tags: ['featured'],
      customizationSections: [
        {
          id: 'size',
          title: 'Bed Size',
          type: 'radio',
          required: true,
          options: [
            { id: 'queen', name: 'Queen (60" x 80")', price: 0 },
            { id: 'king', name: 'King (76" x 80")', price: 400 },
            { id: 'cal-king', name: 'California King (72" x 84")', price: 500 }
          ]
        },
        {
          id: 'headboard',
          title: 'Headboard Style',
          type: 'radio',
          required: false,
          options: [
            { id: 'standard', name: 'Standard Headboard', price: 0 },
            { id: 'upholstered', name: 'Upholstered Headboard', price: 300 },
            { id: 'tufted', name: 'Tufted Luxury Headboard', price: 600 }
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Ergonomic Office Chair',
      price: 649,
      originalPrice: 799,
      images: [
        'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      category: 'Office',
      description: 'Professional office chair with lumbar support',
      specifications: { Material: 'Mesh & Leather', Features: 'Adjustable Height' },
      inStock: true,
      rating: 4.6,
      reviewCount: 203,
      tags: ['ergonomic', 'sale']
    },
    {
      id: '5',
      name: 'Glass Coffee Table',
      price: 599,
      images: [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      category: 'Living Room',
      description: 'Elegant tempered glass coffee table with metal frame',
      specifications: { Material: 'Tempered Glass', Dimensions: '48"L x 24"W x 18"H' },
      inStock: false,
      rating: 4.5,
      reviewCount: 67,
      tags: ['modern']
    },
    {
      id: '6',
      name: 'Vintage Bookshelf',
      price: 1199,
      images: [
        'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      category: 'Office',
      description: 'Industrial-style bookshelf with metal and wood construction',
      specifications: { Material: 'Reclaimed Wood & Steel', Dimensions: '72"H x 36"W x 12"D' },
      inStock: true,
      rating: 4.8,
      reviewCount: 91,
      tags: ['vintage', 'eco-friendly']
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Featured Products
          </h2>
          <p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Handpicked furniture pieces that combine style, comfort, and quality craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Tags */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                {product.tags.includes('sale') && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Sale
                  </span>
                )}
                {product.tags.includes('new') && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    New
                  </span>
                )}
                {product.tags.includes('bestseller') && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110">
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
              </button>

              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.images[1] && hoveredProduct === product.id && (
                  <img
                    src={product.images[1]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />
                )}

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center space-x-4 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 transition-all duration-200 hover:scale-110 flex items-center justify-center"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-600 font-medium">{product.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.reviewCount})</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {product.colors && (
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 3).map((color, idx) => (
                        <div
                          key={`${product.id}-color-${idx}`}
                          className="w-6 h-6 rounded-full border-2 border-gray-200"
                          style={{
                            backgroundColor: color === 'Navy' ? '#1e3a8a' :
                                           color === 'Emerald' ? '#059669' :
                                           color === 'Blush' ? '#f3e8ff' : '#9ca3af'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>


              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;