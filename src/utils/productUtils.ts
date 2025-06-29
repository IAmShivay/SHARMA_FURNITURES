import { Product } from '../types';

/**
 * Format product price for display
 */
export const formatProductPrice = (product: Product): {
  currentPrice: string;
  originalPrice?: string;
  savings?: string;
  discountPercentage?: number;
} => {
  const currentPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  if (product.originalPrice && product.originalPrice > product.price) {
    const originalPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(product.originalPrice);

    const savings = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(product.originalPrice - product.price);

    const discountPercentage = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

    return {
      currentPrice,
      originalPrice,
      savings,
      discountPercentage,
    };
  }

  return { currentPrice };
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (product: Product): boolean => {
  return product.inventory > 0;
};

/**
 * Check if product is low stock
 */
export const isProductLowStock = (product: Product, threshold: number = 10): boolean => {
  return product.inventory > 0 && product.inventory <= threshold;
};

/**
 * Get product availability status
 */
export const getProductAvailabilityStatus = (product: Product): {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  message: string;
  color: string;
} => {
  if (product.inventory === 0) {
    return {
      status: 'out-of-stock',
      message: 'Out of Stock',
      color: 'text-red-600',
    };
  }

  if (isProductLowStock(product)) {
    return {
      status: 'low-stock',
      message: `Only ${product.inventory} left in stock`,
      color: 'text-orange-600',
    };
  }

  return {
    status: 'in-stock',
    message: 'In Stock',
    color: 'text-green-600',
  };
};

/**
 * Generate product URL slug
 */
export const generateProductSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Get product rating display
 */
export const getProductRatingDisplay = (rating: number, reviewCount: number): {
  stars: number;
  percentage: number;
  reviewText: string;
} => {
  return {
    stars: Math.round(rating * 2) / 2, // Round to nearest 0.5
    percentage: (rating / 5) * 100,
    reviewText: reviewCount === 1 ? '1 review' : `${reviewCount} reviews`,
  };
};

/**
 * Filter products by criteria
 */
export const filterProducts = (
  products: Product[],
  filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    search?: string;
  }
): Product[] => {
  return products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.priceMin && product.price < filters.priceMin) {
      return false;
    }

    if (filters.priceMax && product.price > filters.priceMax) {
      return false;
    }

    // Stock filter
    if (filters.inStock && !isProductInStock(product)) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort products by criteria
 */
export const sortProducts = (
  products: Product[],
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest'
): Product[] => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);

    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);

    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);

    case 'newest':
      return sortedProducts.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

    default:
      return sortedProducts;
  }
};

/**
 * Get related products
 */
export const getRelatedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] => {
  return allProducts
    .filter((product) => 
      product.id !== currentProduct.id &&
      product.category === currentProduct.category
    )
    .slice(0, limit);
};

/**
 * Calculate product dimensions display
 */
export const formatProductDimensions = (product: Product): string => {
  if (!product.dimensions) return 'Dimensions not available';
  
  const { length, width, height } = product.dimensions;
  return `${length}" W × ${width}" D × ${height}" H`;
};

/**
 * Get product features list
 */
export const getProductFeatures = (product: Product): string[] => {
  const features = [];
  
  if (product.materials?.length) {
    features.push(`Materials: ${product.materials.join(', ')}`);
  }
  
  if (product.colors?.length) {
    features.push(`Available Colors: ${product.colors.join(', ')}`);
  }
  
  if (product.warranty) {
    features.push(`Warranty: ${product.warranty}`);
  }
  
  if (product.assembly) {
    features.push(`Assembly: ${product.assembly}`);
  }
  
  return features;
};

/**
 * Check if product has customization options
 */
export const hasCustomizationOptions = (product: Product): boolean => {
  return !!(
    product.customization?.woodTypes?.length ||
    product.customization?.finishes?.length ||
    product.customization?.hardware?.length ||
    product.customization?.protection?.length
  );
};

/**
 * Get product badges
 */
export const getProductBadges = (product: Product): Array<{
  text: string;
  color: string;
  bgColor: string;
}> => {
  const badges = [];

  if (product.featured) {
    badges.push({
      text: 'Featured',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
    });
  }

  if (product.bestseller) {
    badges.push({
      text: 'Bestseller',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
    });
  }

  if (product.newArrival) {
    badges.push({
      text: 'New',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
    });
  }

  if (product.originalPrice && product.originalPrice > product.price) {
    const discountPercentage = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    badges.push({
      text: `${discountPercentage}% OFF`,
      color: 'text-red-800',
      bgColor: 'bg-red-100',
    });
  }

  return badges;
};

/**
 * Validate product data
 */
export const validateProduct = (product: Partial<Product>): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!product.name?.trim()) {
    errors.push('Product name is required');
  }

  if (!product.description?.trim()) {
    errors.push('Product description is required');
  }

  if (!product.price || product.price <= 0) {
    errors.push('Product price must be greater than 0');
  }

  if (!product.category?.trim()) {
    errors.push('Product category is required');
  }

  if (!product.images?.length) {
    errors.push('At least one product image is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
