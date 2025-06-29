import React from 'react';
import { Heart, ShoppingBag, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/cartUtils';
import AddToCartButton from '../product/AddToCartButton';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Mock product data - in real app, you'd fetch this based on wishlist IDs
  const wishlistProducts = [
    {
      id: '1',
      name: 'Velvet Accent Chair',
      price: 899,
      originalPrice: 1199,
      image: 'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.8,
      reviewCount: 124,
      inStock: true
    },
    {
      id: '2',
      name: 'Scandinavian Dining Table',
      price: 1299,
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.9,
      reviewCount: 87,
      inStock: true
    }
  ].filter(product => wishlist.includes(product.id));



  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId, productName);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
                My Wishlist
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-playfair">
                Save your favorite items for later
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
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
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-montserrat">
              My Wishlist
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-playfair">
              Your saved favorites collection
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <span>✓ Save Favorites</span>
              <span>✓ Quick Access</span>
              <span>✓ Share Lists</span>
              <span>✓ {wishlistProducts.length} Items Saved</span>
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
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
              </span>
            </div>

            {wishlistProducts.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-amber-600 transition-colors font-montserrat">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                    <span className="text-sm text-gray-400">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <AddToCartButton
                      product={product as any}
                      variant="primary"
                      size="md"
                      disabled={!product.inStock}
                      className="flex-1"
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </AddToCartButton>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                      className="p-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
