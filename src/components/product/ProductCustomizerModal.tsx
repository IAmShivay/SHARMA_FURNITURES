import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Plus, Minus } from 'lucide-react';
import ProductCustomizer from './ProductCustomizer';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatPrice } from '../../utils/cartUtils';
import { Product } from '../../types';

interface ProductCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  className?: string;
}

const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  isOpen,
  onClose,
  product,
  className = '',
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<any>({});
  const [customizationCost, setCustomizationCost] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCustomization({});
      setCustomizationCost(0);
      setSelectedImage(0);
    }
  }, [isOpen]);

  const handleCustomizationChange = (customizationData: any, totalCost: number) => {
    setCustomization(customizationData);
    setCustomizationCost(totalCost);
  };

  const handleAddToCart = () => {
    const finalPrice = (product.basePrice || product.price) + customizationCost;
    
    addToCart(
      product.id || product._id,
      product.name,
      finalPrice,
      product.images?.[selectedImage] || product.image || 'https://via.placeholder.com/400',
      quantity,
      customization
    );
    
    onClose();
  };

  const handleWishlist = () => {
    toggleWishlist(product.id || product._id, product.name);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const finalPrice = (product.basePrice || product.price) + customizationCost;
  const totalPrice = finalPrice * quantity;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-start sm:items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className={`
          relative bg-white rounded-xl sm:rounded-2xl shadow-2xl
          w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl
          max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
          transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95
          mt-4 sm:mt-0
          ${className}
        `}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-montserrat">
              Customize Your Product
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Product Images */}
              <div className="space-y-3 sm:space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    src={product.images?.[selectedImage] || product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`
                          aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-colors
                          ${selectedImage === index
                            ? 'border-amber-500'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <img
                          src={image || 'https://via.placeholder.com/150'}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details & Customization */}
              <div className="space-y-6">
                {/* Product Info */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description || product.shortDescription}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(finalPrice)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {customizationCost > 0 && (
                      <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        +{formatPrice(customizationCost)} customization
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={decrementQuantity}
                      className="p-1.5 sm:p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-sm sm:text-base">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="p-1.5 sm:p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Customization Options */}
                {product.customizationSections && product.customizationSections.length > 0 && (
                  <ProductCustomizer
                    customizationSections={product.customizationSections}
                    onCustomizationChange={handleCustomizationChange}
                    className="border-t border-gray-200 pt-6"
                  />
                )}

                {/* Action Buttons */}
                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                  {/* Total Price */}
                  <div className="flex items-center justify-between text-base sm:text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-xl sm:text-2xl text-amber-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={handleWishlist}
                      className={`
                        py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 border-2 text-sm sm:text-base
                        ${isInWishlist(product.id || product._id)
                          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist(product.id || product._id) ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{isInWishlist(product.id || product._id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                      <span className="sm:hidden">{isInWishlist(product.id || product._id) ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizerModal;
