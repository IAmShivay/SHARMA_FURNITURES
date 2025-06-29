const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'United States'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager', 'support'],
    default: 'customer'
  },
  avatar: {
    type: String,
    default: ''
  },
  addresses: [addressSchema],
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    currency: {
      type: String,
      default: 'USD'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    customization: {
      woodType: String,
      finish: String,
      color: String,
      assembly: String,
      hardware: [String],
      protection: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Add to wishlist
userSchema.methods.addToWishlist = function(productId) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
  }
  return this.save();
};

// Remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(id => !id.equals(productId));
  return this.save();
};

// Add to cart
userSchema.methods.addToCart = function(productId, quantity = 1, customization = {}) {
  const existingItem = this.cart.find(item => 
    item.product.equals(productId) && 
    JSON.stringify(item.customization) === JSON.stringify(customization)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      quantity,
      customization
    });
  }

  return this.save();
};

// Remove from cart
userSchema.methods.removeFromCart = function(itemId) {
  this.cart = this.cart.filter(item => !item._id.equals(itemId));
  return this.save();
};

// Update cart item quantity
userSchema.methods.updateCartQuantity = function(itemId, quantity) {
  const item = this.cart.find(item => item._id.equals(itemId));
  if (item) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }
    item.quantity = quantity;
  }
  return this.save();
};

// Clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Calculate cart total
userSchema.methods.getCartTotal = async function() {
  await this.populate('cart.product');
  
  return this.cart.reduce((total, item) => {
    let itemPrice = item.product.basePrice;
    
    // Add customization costs
    if (item.customization) {
      // This would need to be calculated based on your customization pricing logic
      // For now, we'll use a simple example
      if (item.customization.woodType === 'walnut') itemPrice += 299;
      if (item.customization.woodType === 'mahogany') itemPrice += 499;
      if (item.customization.woodType === 'teak') itemPrice += 699;
      
      if (item.customization.finish === 'satin') itemPrice += 149;
      if (item.customization.finish === 'gloss') itemPrice += 199;
      if (item.customization.finish === 'distressed') itemPrice += 249;
      
      // Add other customization costs...
    }
    
    return total + (itemPrice * item.quantity);
  }, 0);
};

module.exports = mongoose.model('User', userSchema);
