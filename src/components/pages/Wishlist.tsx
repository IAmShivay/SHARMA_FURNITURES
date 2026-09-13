import React from 'react';
import { Heart, ShoppingBag, X, Star, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { formatPrice } from '../../utils/cartUtils';
import AddToCartButton from '../product/AddToCartButton';
import SEOHead from '../../components/common/SEOHead';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
        <SEOHead title="My Wishlist | LuxeHome" description="View and manage your saved favorite furniture items." noIndex={true} />
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">My Wishlist</h1>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
        <SEOHead title="My Wishlist | LuxeHome" description="View and manage your saved favorite furniture items." noIndex={true} />
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
                My Wishlist
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair">
                Save your favorite items for later
              </p>
              <div className="flex items-center justify-center flex-wrap space-x-4 sm:space-x-6 lg:space-x-8 text-sm text-gray-600">
                <span>✓ Save Favorites</span>
                <span>✓ Quick Access</span>
                <span>✓ Share Lists</span>
                <span>✓ 0 Items Saved</span>
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        <div className="container mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Start adding items you love to your wishlist. You can save items while browsing and come back to them later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:pt-32 lg:pt-36">
      <SEOHead title="My Wishlist | LuxeHome" description="View and manage your saved favorite furniture items." noIndex={true} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-montserrat">
              My Wishlist
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-playfair">
              Your saved favorites collection
            </p>
            <div className="flex items-center justify-center flex-wrap space-x-4 sm:space-x-6 lg:space-x-8 text-sm text-gray-600">
              <span>✓ Save Favorites</span>
              <span>✓ Quick Access</span>
              <span>✓ Share Lists</span>
              <span>✓ {wishlistItems.length} Items Saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-gray-600 font-medium">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </span>
            </div>

            <button
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Clear All
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {wishlistItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div key={item.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.productId, product.name)}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Sale Badge */}
                    {product.originalPrice && product.originalPrice > product.basePrice && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Sale
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-amber-600 transition-colors font-montserrat">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center space-x-1 mb-3">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {typeof product.rating === 'object' ? product.rating.average : product.rating}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.basePrice)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.basePrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item.productId, product.name)}
                        className="p-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white text-amber-600 border-2 border-amber-600 px-8 py-4 rounded-xl font-bold hover:bg-amber-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
