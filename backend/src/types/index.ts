import { Request } from 'express';
import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'support' | 'manager' | 'admin';
  avatar?: string;
  addresses: IAddress[];
  preferences: IUserPreferences;
  wishlist: string[];
  cart: ICartItem[];
  loyaltyPoints: number;
  totalSpent: number;
  lastLogin?: Date;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  updateLastLogin(): Promise<IUser>;
  addToWishlist(productId: string): Promise<IUser>;
  removeFromWishlist(productId: string): Promise<IUser>;
  addToCart(productId: string, quantity: number, customization?: any): Promise<IUser>;
  removeFromCart(itemId: string): Promise<IUser>;
  updateCartQuantity(itemId: string, quantity: number): Promise<IUser>;
  clearCart(): Promise<IUser>;
  getCartTotal(): Promise<number>;
}

export interface IAddress {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUserPreferences {
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
  };
  currency: string;
  language: string;
}

export interface ICartItem {
  product: string;
  quantity: number;
  customization?: {
    woodType?: string;
    finish?: string;
    color?: string;
    assembly?: string;
    hardware?: string[];
    protection?: string;
  };
  addedAt: Date;
}

// Product Types
export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  brand: string;
  category: string;
  subcategory: string;
  tags: string[];
  basePrice: number;
  originalPrice?: number;
  costPrice?: number;
  currency: string;
  images: string[];
  videos?: string[];
  dimensions: IDimensions;
  materials: string[];
  colors: string[];
  styles: string[];
  features: string[];
  specifications: ISpecification[];
  customization: ICustomizationSection[];
  variants: IProductVariant[];
  inventory: IInventory;
  shipping: IShippingInfo;
  seo: ISEOData;
  rating: IRating;
  reviews: IReview[];
  status: 'draft' | 'active' | 'inactive' | 'discontinued';
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  onSale: boolean;
  saleStartDate?: Date;
  saleEndDate?: Date;
  viewCount: number;
  salesCount: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  availableQuantity: number;
  discountPercentage: number;
  inStock: boolean;
  lowStock: boolean;

  // Methods
  updateRating(): void;
  addReview(userId: string, rating: number, title: string, comment: string, images?: string[]): Promise<IProduct>;
  reserveInventory(quantity: number): Promise<IProduct>;
  releaseReservedInventory(quantity: number): Promise<IProduct>;
  fulfillOrder(quantity: number): Promise<IProduct>;
}

export interface IDimensions {
  length: string;
  width: string;
  height: string;
  weight: string;
  unit: string;
}

export interface ISpecification {
  name: string;
  value: string;
}

export interface ICustomizationSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  type: 'single' | 'multiple';
  options: ICustomizationOption[];
}

export interface ICustomizationOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

export interface IProductVariant {
  sku: string;
  name?: string;
  price?: number;
  images?: string[];
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    finish?: string;
  };
  inventory: IInventory;
}

export interface IInventory {
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
  trackInventory: boolean;
}

export interface IShippingInfo {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  freeShipping: boolean;
  shippingClass: 'standard' | 'white-glove' | 'freight';
}

export interface ISEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface IRating {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface IReview {
  user: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  user: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: IOrderShipping;
  discount: IDiscount;
  total: number;
  currency: string;
  status: OrderStatus;
  payment: IPayment;
  shippingAddress: IShippingAddress;
  billingAddress: IShippingAddress;
  notes?: string;
  internalNotes?: string;
  customerService: ICustomerServiceTicket[];
  timeline: IOrderTimeline[];
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  returnWindow?: Date;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  source: 'website' | 'mobile_app' | 'phone' | 'store' | 'marketplace';
  referrer?: string;
  utm?: IUTMData;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  ageInDays: number;
  canBeCancelled: boolean;
  canBeReturned: boolean;

  // Methods
  addTimelineEntry(status: string, description: string, updatedBy?: string): Promise<IOrder>;
  updateShippingStatus(status: string, location?: string, description?: string): Promise<IOrder>;
  processPayment(transactionId: string, paymentIntentId?: string): Promise<IOrder>;
  cancelOrder(reason: string, cancelledBy?: string): Promise<IOrder>;
  processRefund(amount: number, reason: string, processedBy?: string): Promise<IOrder>;
  addCustomerServiceInquiry(type: string, subject: string, message: string, priority?: string): Promise<IOrder>;
  respondToInquiry(inquiryId: string, response: string, respondedBy?: string, status?: string): Promise<IOrder>;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'returned'
  | 'disputed';

export interface IOrderItem {
  product: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  customization?: {
    woodType?: string;
    finish?: string;
    color?: string;
    assembly?: string;
    hardware?: string[];
    protection?: string;
    customizationCost?: number;
  };
  sku?: string;
  variant?: string;
}

export interface IOrderShipping {
  method: 'standard' | 'express' | 'white_glove' | 'freight' | 'pickup';
  cost: number;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  carrier?: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  updates: IShippingUpdate[];
}

export interface IShippingUpdate {
  status: string;
  location?: string;
  timestamp: Date;
  description?: string;
}

export interface IDiscount {
  amount: number;
  code?: string;
  type?: 'percentage' | 'fixed' | 'free_shipping';
}

export interface IPayment {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'financing';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  transactionId?: string;
  paymentIntentId?: string;
  amount: number;
  currency: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount: number;
  processingFee: number;
}

export interface IShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  instructions?: string;
}

export interface ICustomerServiceTicket {
  type: 'inquiry' | 'complaint' | 'request' | 'feedback';
  subject: string;
  message: string;
  response?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderTimeline {
  status: string;
  timestamp: Date;
  description?: string;
  updatedBy?: string;
}

export interface IUTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// Request Types
export interface AuthenticatedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: IUser;
  ownershipCheck?: {
    field: string;
    userId: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message?: string;
  data: {
    items: T[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  };
  errors?: any[];
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  colors?: string[];
  styles?: string[];
  brands?: string[];
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: string;
  shippingStatus?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
