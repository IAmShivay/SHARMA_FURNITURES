export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  description: string;
  specifications: Record<string, string>;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  colors?: string[];
  materials?: string[];
  tags: string[];
  sku?: string;
  weight?: string;
  dimensions?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  materials: string[];
  inStock: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  description: string;
  founded: string;
  location: string;
  values: string[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  youtube?: string;
}