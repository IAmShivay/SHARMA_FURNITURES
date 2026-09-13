import React, { useState, useEffect, useCallback } from 'react';
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
import SEOHead from '../../../components/common/SEOHead';

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

const LivingRoomCollection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  // Fetch products from API
  const { products: apiProducts, loading: apiLoading, error } = useProducts({
    category: 'chairs,sofas,tables', // Living room categories
    limit: 20
  });

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: any) => {
    setAppliedFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setAppliedFilters({});
  }, []);

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
    customization: product.customization || []
  }));

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

    // Apply material filters
    if (appliedFilters.materials?.length > 0) {
      const materialMap: { [key: string]: string } = {
        'wood': 'Wood',
        'metal': 'Metal',
        'fabric': 'Fabric',
        'leather': 'Leather',
        'glass': 'Glass',
        'velvet': 'Velvet'
      };
      const productMaterial = Object.keys(materialMap).find(key =>
        materialMap[key] === product.material
      );
      if (!productMaterial || !appliedFilters.materials.includes(productMaterial)) {
        return false;
      }
    }

    // Apply color filters
    if (appliedFilters.colors?.length > 0) {
      const colorMap: { [key: string]: string } = {
        'gray': 'Gray',
        'brown': 'Brown',
        'black': 'Black',
        'white': 'White',
        'navy': 'Navy',
        'beige': 'Beige'
      };
      const productColor = Object.keys(colorMap).find(key =>
        colorMap[key] === product.color
      );
      if (!productColor || !appliedFilters.colors.includes(productColor)) {
        return false;
      }
    }

    // Apply style filters
    if (appliedFilters.styles?.length > 0) {
      const styleMap: { [key: string]: string } = {
        'modern': 'Modern',
        'traditional': 'Traditional',
        'contemporary': 'Contemporary',
        'scandinavian': 'Scandinavian'
      };
      const productStyle = Object.keys(styleMap).find(key =>
        styleMap[key] === product.style
      );
      if (!productStyle || !appliedFilters.styles.includes(productStyle)) {
        return false;
      }
    }

    // Apply availability filters
    if (appliedFilters.availability?.length > 0) {
      if (appliedFilters.availability.includes('in-stock') && !product.inStock) {
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
        
        {/* Badges */}
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

      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-amber-600 font-semibold uppercase tracking-wider">
            {product.category}
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-montserrat line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
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
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
                Living Room Collection
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
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
                Living Room Collection
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
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead
        title="Living Room Collection | LuxeHome"
        description="Shop our living room furniture collection including sofas, coffee tables, and accent chairs."
        keywords="living room furniture, sofas, coffee tables, accent chairs"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
              Living Room Collection
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair">
              Transform your living space with our curated selection of premium sofas, chairs, tables, and accessories
            </p>
            <div className="flex items-center justify-center flex-wrap space-x-4 sm:space-x-6 lg:space-x-8 text-sm text-gray-600">
              <span>✓ Free White-Glove Delivery</span>
              <span>✓ 30-Day Returns</span>
              <span>✓ Lifetime Warranty</span>
              <span>✓ {products.length} Products Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle & Results */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <span className="text-gray-600">
                {filteredProducts.length} of {products.length} products
              </span>
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
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
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
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
                <div className="text-center py-16">
                  <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or browse our full collection</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors duration-200"
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

export default LivingRoomCollection;
