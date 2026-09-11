import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, IDimensions, ISpecification, ICustomizationSection, IProductVariant, IInventory, IShippingInfo, ISEOData, IRating, IReview } from '../types';

// Sub-schemas
const DimensionsSchema = new Schema<IDimensions>({
  length: { type: String, required: true },
  width: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  unit: { type: String, default: 'inches' },
});

const SpecificationSchema = new Schema<ISpecification>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const CustomizationOptionSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  image: String,
  available: { type: Boolean, default: true },
});

const CustomizationSectionSchema = new Schema<ICustomizationSection>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  required: { type: Boolean, default: false },
  type: { type: String, enum: ['single', 'multiple'], required: true },
  options: [CustomizationOptionSchema],
});

const InventorySchema = new Schema<IInventory>({
  quantity: { type: Number, required: true, min: 0 },
  reserved: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10, min: 0 },
  trackInventory: { type: Boolean, default: true },
});

const VariantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true },
  name: String,
  price: Number,
  images: [String],
  attributes: {
    color: String,
    size: String,
    material: String,
    finish: String,
  },
  inventory: InventorySchema,
});

const ShippingInfoSchema = new Schema<IShippingInfo>({
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  freeShipping: { type: Boolean, default: false },
  shippingClass: { 
    type: String, 
    enum: ['standard', 'white-glove', 'freight'], 
    default: 'standard' 
  },
});

const SEODataSchema = new Schema<ISEOData>({
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  keywords: [String],
});

const RatingSchema = new Schema<IRating>({
  average: { type: Number, default: 0, min: 0, max: 5 },
  count: { type: Number, default: 0, min: 0 },
  distribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 },
  },
});

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 1000 },
  images: [String],
  verified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Main Product Schema
const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: true, 
    maxlength: 100,
    trim: true,
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 2000,
  },
  shortDescription: { 
    type: String, 
    maxlength: 500,
  },
  brand: { 
    type: String, 
    required: true,
    trim: true,
  },
  category: { 
    type: String, 
    required: true,
    enum: ['sofas', 'chairs', 'tables', 'storage', 'lighting', 'decor', 'bedroom', 'dining', 'office'],
  },
  subcategory: { 
    type: String, 
    required: true,
    trim: true,
  },
  tags: [String],
  basePrice: { 
    type: Number, 
    required: true, 
    min: 0,
  },
  originalPrice: { 
    type: Number, 
    min: 0,
  },
  costPrice: { 
    type: Number, 
    min: 0,
  },
  currency: { 
    type: String, 
    default: 'USD',
  },
  images: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one image is required',
    },
  },
  videos: [String],
  dimensions: DimensionsSchema,
  materials: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one material is required',
    },
  },
  colors: { 
    type: [String], 
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one color is required',
    },
  },
  styles: [String],
  features: [String],
  specifications: [SpecificationSchema],
  customization: [CustomizationSectionSchema],
  variants: [VariantSchema],
  inventory: { 
    type: InventorySchema, 
    required: true,
  },
  shipping: ShippingInfoSchema,
  seo: SEODataSchema,
  rating: { 
    type: RatingSchema, 
    default: () => ({
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }),
  },
  reviews: [ReviewSchema],
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive', 'discontinued'], 
    default: 'draft',
  },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  saleStartDate: Date,
  saleEndDate: Date,
  viewCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  createdBy: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ salesCount: -1 });
ProductSchema.index({ viewCount: -1 });
ProductSchema.index({ createdAt: -1 });

// Virtuals
ProductSchema.virtual('availableQuantity').get(function(this: IProduct) {
  if (!this.inventory) return 0;
  return Math.max(0, (this.inventory.quantity || 0) - (this.inventory.reserved || 0));
});

ProductSchema.virtual('discountPercentage').get(function(this: IProduct) {
  if (!this.originalPrice || this.originalPrice <= this.basePrice) return 0;
  return Math.round(((this.originalPrice - this.basePrice) / this.originalPrice) * 100);
});

ProductSchema.virtual('inStock').get(function(this: IProduct) {
  return this.availableQuantity > 0;
});

ProductSchema.virtual('lowStock').get(function(this: IProduct) {
  if (!this.inventory) return false;
  return this.availableQuantity > 0 && this.availableQuantity <= (this.inventory.lowStockThreshold || 0);
});

// Methods
ProductSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = {
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
    return;
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  this.reviews.forEach((review: any) => {
    distribution[review.rating as keyof typeof distribution]++;
    totalRating += review.rating;
  });

  this.rating = {
    average: Number((totalRating / this.reviews.length).toFixed(1)),
    count: this.reviews.length,
    distribution,
  };
};

ProductSchema.methods.addReview = async function(
  userId: string, 
  rating: number, 
  title: string, 
  comment: string, 
  images?: string[]
) {
  this.reviews.push({
    user: userId,
    rating,
    title,
    comment,
    images: images || [],
    verified: false, // Set to true if user has purchased this product
    helpful: 0,
    reported: false,
  });

  this.updateRating();
  return await this.save();
};

ProductSchema.methods.reserveInventory = async function(quantity: number) {
  if (this.availableQuantity < quantity) {
    throw new Error('Insufficient inventory available');
  }
  
  this.inventory.reserved += quantity;
  return await this.save();
};

ProductSchema.methods.releaseReservedInventory = async function(quantity: number) {
  this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
  return await this.save();
};

ProductSchema.methods.fulfillOrder = async function(quantity: number) {
  if (this.inventory.quantity < quantity) {
    throw new Error('Insufficient inventory to fulfill order');
  }
  
  this.inventory.quantity -= quantity;
  this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
  this.salesCount += quantity;
  
  return await this.save();
};

// Pre-save middleware
ProductSchema.pre('save', function(this: IProduct, next) {
  // Auto-generate slug if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Set onSale flag based on prices
  if (this.originalPrice && this.originalPrice > this.basePrice) {
    this.onSale = true;
  } else {
    this.onSale = false;
  }

  next();
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
