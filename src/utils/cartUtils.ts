import { Product } from '../types';
import { CartItem } from '../store/slices/cartSlice';

/**
 * Add product to cart with proper formatting
 */
export const addProductToCart = (
  product: Product,
  quantity: number = 1,
  customization?: any
): Omit<CartItem, 'id'> => {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    quantity,
    customization,
  };
};

/**
 * Calculate cart item total price including customization
 */
export const calculateItemTotal = (item: CartItem): number => {
  const basePrice = item.price;
  const customizationCost = item.customization?.customizationCost || 0;
  return (basePrice + customizationCost) * item.quantity;
};

/**
 * Calculate cart subtotal
 */
export const calculateCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
};

/**
 * Calculate tax amount
 */
export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
  return subtotal * taxRate;
};

/**
 * Calculate shipping cost
 */
export const calculateShipping = (subtotal: number, freeShippingThreshold: number = 500): number => {
  return subtotal >= freeShippingThreshold ? 0 : 50;
};

/**
 * Calculate final total
 */
export const calculateCartTotal = (
  items: CartItem[],
  taxRate: number = 0.08,
  freeShippingThreshold: number = 500
): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} => {
  const subtotal = calculateCartSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, freeShippingThreshold);
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Check if two cart items are the same (including customization)
 */
export const areCartItemsEqual = (item1: CartItem, item2: CartItem): boolean => {
  return (
    item1.productId === item2.productId &&
    JSON.stringify(item1.customization) === JSON.stringify(item2.customization)
  );
};

/**
 * Generate unique cart item ID
 */
export const generateCartItemId = (productId: string, customization?: any): string => {
  const customizationHash = customization 
    ? btoa(JSON.stringify(customization)).slice(0, 8)
    : 'default';
  return `${productId}-${customizationHash}-${Date.now()}`;
};

/**
 * Validate cart item quantity
 */
export const validateQuantity = (quantity: number, maxQuantity?: number): boolean => {
  if (quantity < 1) return false;
  if (maxQuantity && quantity > maxQuantity) return false;
  return true;
};

/**
 * Get cart item display name with customization
 */
export const getCartItemDisplayName = (item: CartItem): string => {
  let displayName = item.name;
  
  if (item.customization) {
    const customizations = [];
    
    if (item.customization.woodType) {
      customizations.push(item.customization.woodType);
    }
    
    if (item.customization.finish) {
      customizations.push(item.customization.finish);
    }
    
    if (item.customization.color) {
      customizations.push(item.customization.color);
    }
    
    if (customizations.length > 0) {
      displayName += ` (${customizations.join(', ')})`;
    }
  }
  
  return displayName;
};

/**
 * Calculate savings amount
 */
export const calculateSavings = (originalPrice: number, salePrice: number): number => {
  return Math.max(0, originalPrice - salePrice);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Check if product is on sale
 */
export const isProductOnSale = (product: Product): boolean => {
  return !!(product.originalPrice && product.originalPrice > product.price);
};

/**
 * Get product sale info
 */
export const getProductSaleInfo = (product: Product) => {
  if (!isProductOnSale(product)) {
    return null;
  }
  
  const savings = calculateSavings(product.originalPrice!, product.price);
  const discountPercentage = calculateDiscountPercentage(product.originalPrice!, product.price);
  
  return {
    savings,
    discountPercentage,
    originalPrice: product.originalPrice!,
    salePrice: product.price,
  };
};
