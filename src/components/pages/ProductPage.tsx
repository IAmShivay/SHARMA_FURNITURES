import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Camera,
  ArrowRight,
  Check,
  Plus,
  Minus
} from 'lucide-react';
import AddToCartButton from '../product/AddToCartButton';
import { useWishlist } from '../../hooks/useWishlist';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showARView, setShowARView] = useState(false);

  // Sample product data - in real app, this would come from API
  const product = {
    id: productId || '1',
    name: 'Luxury Velvet Accent Chair',
    brand: 'LuxeHome',
    basePrice: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 124,
    description: 'Transform your living space with this exquisite velvet accent chair. Crafted with premium materials and attention to detail, this piece combines comfort with sophisticated style.',
    features: [
      'Premium velvet upholstery',
      'Solid hardwood frame',
      'High-density foam cushioning',
      'Elegant brass accents',
      'Easy assembly'
    ],
    dimensions: {
      length: '32"',
      width: '30"',
      height: '35"',
      weight: '45 lbs'
    },
    images: [
      'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    customizationSections: [
      {
        id: 'color',
        title: 'Choose Color',
        type: 'color',
        required: true,
        options: [
          { id: 'navy', name: 'Navy Blue', price: 0, image: 'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600' },
          { id: 'emerald', name: 'Emerald Green', price: 50, image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600' },
          { id: 'blush', name: 'Blush Pink', price: 50, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600' }
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
      },
      {
        id: 'assembly',
        title: 'Assembly Service',
        type: 'checkbox',
        required: false,
        options: [
          { id: 'assembly', name: 'Professional Assembly & Setup', price: 150 }
        ]
      }
    ]
  };

  const isWishlisted = isInWishlist(productId || '');

  const handleWishlistToggle = () => {
    toggleWishlist(productId || '', product.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 lg:pt-28">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-amber-600">Products</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 p-8">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                
                {/* Image Controls */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => setShowARView(true)}
                    className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-200">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-gray-100 rounded-lg overflow-hidden aspect-square transition-all duration-200 ${
                      selectedImage === index 
                        ? 'ring-2 ring-amber-500' 
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleWishlistToggle}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isWishlisted 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) 
                            ? 'text-amber-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.basePrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${(product.originalPrice - product.basePrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed font-playfair">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-montserrat">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AddToCartButton
                  product={product as any}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Add to Cart - ${(product.basePrice * quantity).toLocaleString()}
                </AddToCartButton>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">2 Year Warranty</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-xs text-gray-600">30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
