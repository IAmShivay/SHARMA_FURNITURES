const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  description: String,
  image: String,
  available: {
    type: Boolean,
    default: true
  }
});

const customizationSectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    default: 'single'
  },
  options: [customizationOptionSchema]
});

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [String],
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  price: Number,
  images: [String],
  attributes: {
    color: String,
    size: String,
    material: String,
    finish: String
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['sofas', 'chairs', 'tables', 'storage', 'lighting', 'decor', 'bedroom', 'dining', 'office']
  },
  subcategory: {
    type: String,
    required: true
  },
  tags: [String],
  basePrice: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: [arrayLimit, 'Cannot have more than 10 images']
  },
  videos: [String],
  dimensions: {
    length: String,
    width: String,
    height: String,
    weight: String,
    unit: {
      type: String,
      default: 'inches'
    }
  },
  materials: [String],
  colors: [String],
  styles: [String],
  features: [String],
  specifications: [{
    name: String,
    value: String
  }],
  customization: [customizationSectionSchema],
  variants: [variantSchema],
  inventory: {
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'white-glove', 'freight'],
      default: 'standard'
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [reviewSchema],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Array limit validator
function arrayLimit(val) {
  return val.length <= 10;
}

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Virtual for available quantity
productSchema.virtual('availableQuantity').get(function() {
  return this.inventory.quantity - this.inventory.reserved;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.basePrice) {
    return Math.round(((this.originalPrice - this.basePrice) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.availableQuantity > 0;
});

// Virtual for low stock status
productSchema.virtual('lowStock').get(function() {
  return this.availableQuantity <= this.inventory.lowStockThreshold && this.availableQuantity > 0;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to update rating
productSchema.methods.updateRating = function() {
  const reviews = this.reviews.filter(review => !review.reported);
  
  if (reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    this.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / reviews.length;
  this.rating.count = reviews.length;

  // Update distribution
  this.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    this.rating.distribution[review.rating]++;
  });
};

// Method to add review
productSchema.methods.addReview = function(userId, rating, title, comment, images = []) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(review => review.user.equals(userId));
  
  if (existingReview) {
    throw new Error('User has already reviewed this product');
  }

  this.reviews.push({
    user: userId,
    rating,
    title,
    comment,
    images
  });

  this.updateRating();
  return this.save();
};

// Method to reserve inventory
productSchema.methods.reserveInventory = function(quantity) {
  if (this.availableQuantity < quantity) {
    throw new Error('Insufficient inventory');
  }
  
  this.inventory.reserved += quantity;
  return this.save();
};

// Method to release reserved inventory
productSchema.methods.releaseReservedInventory = function(quantity) {
  this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
  return this.save();
};

// Method to fulfill order (reduce actual inventory)
productSchema.methods.fulfillOrder = function(quantity) {
  if (this.inventory.quantity < quantity) {
    throw new Error('Insufficient inventory');
  }
  
  this.inventory.quantity -= quantity;
  this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
  this.salesCount += quantity;
  
  return this.save();
};

// Static method to find products with filters
productSchema.statics.findWithFilters = function(filters = {}) {
  const query = { status: 'active' };
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.subcategory) {
    query.subcategory = filters.subcategory;
  }
  
  if (filters.priceMin || filters.priceMax) {
    query.basePrice = {};
    if (filters.priceMin) query.basePrice.$gte = filters.priceMin;
    if (filters.priceMax) query.basePrice.$lte = filters.priceMax;
  }
  
  if (filters.materials && filters.materials.length > 0) {
    query.materials = { $in: filters.materials };
  }
  
  if (filters.colors && filters.colors.length > 0) {
    query.colors = { $in: filters.colors };
  }
  
  if (filters.styles && filters.styles.length > 0) {
    query.styles = { $in: filters.styles };
  }
  
  if (filters.inStock) {
    query['inventory.quantity'] = { $gt: 0 };
  }
  
  if (filters.featured) {
    query.featured = true;
  }
  
  if (filters.onSale) {
    query.onSale = true;
  }
  
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Product', productSchema);
