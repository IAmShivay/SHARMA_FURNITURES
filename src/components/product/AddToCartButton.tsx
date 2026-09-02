import React, { useState } from 'react';
import { ShoppingBag, Settings } from 'lucide-react';
import ProductCustomizerModal from './ProductCustomizerModal';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/cartUtils';
import { Product } from '../../types';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showPrice?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'primary',
  size = 'md',
  showPrice = false,
  disabled = false,
  className = '',
  children,
}) => {
  const { addToCart } = useCart();
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Check if product has customization options
  const hasCustomization = product.customization && product.customization.length > 0;

  const handleClick = () => {
    if (hasCustomization) {
      // Show customizer modal
      setShowCustomizer(true);
    } else {
      // Add directly to cart with default options
      addToCart(
        product.id || product._id,
        product.name,
        product.basePrice || product.price,
        product.images?.[0] || product.image || '',
        1
      );
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700',
    secondary: 'bg-white text-amber-600 border-2 border-amber-600 hover:bg-amber-50',
    icon: 'bg-amber-600 text-white hover:bg-amber-700 p-3 rounded-full',
  };

  // Icon size based on button size
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const baseClasses = `
    font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    flex items-center justify-center space-x-2
  `;

  const buttonClasses = `
    ${baseClasses}
    ${variant === 'icon' ? 'rounded-full' : 'rounded-xl'}
    ${variant !== 'icon' ? sizeClasses[size] : ''}
    ${variantClasses[variant]}
    ${className}
  `;

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={disabled}
          className={buttonClasses}
          title={hasCustomization ? 'Customize & Add to Cart' : 'Add to Cart'}
        >
          {hasCustomization ? (
            <Settings className={iconSizes[size]} />
          ) : (
            <ShoppingBag className={iconSizes[size]} />
          )}
        </button>

        <ProductCustomizerModal
          isOpen={showCustomizer}
          onClose={() => setShowCustomizer(false)}
          product={product}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={buttonClasses}
      >
        {hasCustomization ? (
          <Settings className={iconSizes[size]} />
        ) : (
          <ShoppingBag className={iconSizes[size]} />
        )}
        
        <span>
          {children || (hasCustomization ? 'Customize' : 'Add to Cart')}
          {showPrice && ` - ${formatPrice(product.basePrice || product.price)}`}
        </span>
      </button>

      <ProductCustomizerModal
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        product={product}
      />
    </>
  );
};

export default AddToCartButton;
