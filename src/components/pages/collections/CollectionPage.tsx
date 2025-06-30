import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  List,
  Star,
  Heart,
  Eye,
  SlidersHorizontal,
  Filter
} from 'lucide-react';
import AmazonStyleFilters from '../../filters/AmazonStyleFilters';
import { useProducts } from '../../../hooks/useProducts';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/cartUtils';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  subcategory: string;
  material: string;
  color: string;
  style: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

const CollectionPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  // Map URL categories to API categories
  const categoryMap: { [key: string]: { api: string; title: string; description: string } } = {
    'living-room': {
      api: 'chairs,sofas,tables',
      title: 'Living Room Collection',
      description: 'Transform your living space with our curated selection of premium furniture'
    },
    'bedroom': {
      api: 'bedroom',
      title: 'Bedroom Collection',
      description: 'Create your perfect sanctuary with our luxurious bedroom furniture'
    },
    'dining': {
      api: 'tables',
      title: 'Dining Collection',
      description: 'Gather in style with our elegant dining room furniture'
    },
    'office': {
      api: 'office',
      title: 'Office Collections',
      description: 'Work in comfort with our professional office furniture'
    }
  };

  const currentCategory = categoryMap[category || 'living-room'];

  // Fetch products from API
  const { products: apiProducts, loading: apiLoading, error } = useProducts({
    category: currentCategory.api,
    limit: 20
  });

  // Convert API products to local Product interface
  const products: Product[] = (apiProducts || []).map((product: any) => ({
    id: product._id || product.id,
    name: product.name,
    price: product.basePrice || product.price,
    originalPrice: product.originalPrice,
    rating: product.rating?.average || 0,
    reviews: product.rating?.count || 0,
    image: product.images?.[0] || '',
    category: product.category,
    subcategory: product.subcategory || '',
    material: product.materials?.[0] || '',
    color: product.colors?.[0] || '',
    style: product.styles?.[0] || 'Modern',
    inStock: product.inventory?.quantity > 0,
    isNew: product.newArrival,
    isBestseller: product.bestseller,
    // Add customization sections for all products
    customizationSections: product.customizationSections || [
      {
        id: 'color',
        title: 'Choose Color',
        type: 'color',
        required: true,
        options: (product.colors || ['Natural', 'Dark', 'Light']).map((color: string, index: number) => ({
          id: color.toLowerCase().replace(/\s+/g, '-'),
          name: color,
          price: index === 0 ? 0 : 50,
          image: product.images?.[index] || product.images?.[0] || ''
        }))
      },
      {
        id: 'material',
        title: 'Material Options',
        type: 'radio',
        required: false,
        options: (product.materials || ['Standard', 'Premium']).map((material: string, index: number) => ({
          id: material.toLowerCase().replace(/\s+/g, '-'),
          name: material,
          price: index === 0 ? 0 : 200
        }))
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
  }));

  const handleFiltersChange = useCallback((filters: any) => {
    setAppliedFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setAppliedFilters({});
  }, []);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    // Apply category filters
    if (appliedFilters.categories?.length > 0) {
      const categoryMap: { [key: string]: string } = {
        'sofas': 'Sofas',
        'chairs': 'Chairs',
        'tables': 'Tables'
      };
      const productCategory = Object.keys(categoryMap).find(key =>
        categoryMap[key] === product.category
      );
      if (!productCategory || !appliedFilters.categories.includes(productCategory)) {
        return false;
      }
    }

    // Apply price range filters
    if (appliedFilters.customPriceRange) {
      const { min, max } = appliedFilters.customPriceRange;
      if (min && product.price < parseInt(min)) return false;
      if (max && product.price > parseInt(max)) return false;
    }

    return true;
  });

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-105 transform-gpu">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Product Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">NEW</span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">BESTSELLER</span>
          )}
          {!product.inStock && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">OUT OF STOCK</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200">
            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>

        {/* Discount Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-amber-600 font-semibold uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 font-montserrat hover:text-amber-600 transition-colors cursor-pointer">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 font-montserrat">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        <Link
          to={`/product/${product.id}`}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center space-x-2 ${
            product.inStock
              ? 'bg-amber-500 text-white hover:bg-amber-600 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{product.inStock ? 'View Product' : 'Out of Stock'}</span>
        </Link>
      </div>
    </div>
  );

  // Show loading state
  if (apiLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
                {currentCategory.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-playfair">
                Loading our curated selection...
              </p>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-3xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
                {currentCategory.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-playfair">
                Unable to load products
              </p>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
            <p className="text-red-600">Failed to load products. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
              {currentCategory.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-playfair">
              {currentCategory.description}
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <span>✓ Free White-Glove Delivery</span>
              <span>✓ 30-Day Returns</span>
              <span>✓ Lifetime Warranty</span>
              <span>✓ {products.length} Products Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 font-montserrat">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <AmazonStyleFilters
                onFiltersChange={handleFiltersChange}
                productCount={filteredProducts.length}
                loading={apiLoading}
              />
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 font-montserrat">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto h-full pb-20">
                  <AmazonStyleFilters
                    onFiltersChange={handleFiltersChange}
                    productCount={filteredProducts.length}
                    loading={apiLoading}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
                  <div className="flex space-x-4">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <span className="text-gray-600 font-medium">
                  {filteredProducts.length} Products
                </span>

                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Mobile View Mode Toggle */}
                <div className="flex sm:hidden items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
