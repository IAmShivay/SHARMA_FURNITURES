import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IAddress, IUserPreferences, ICartItem } from '../types';

// Sub-schemas
const AddressSchema = new Schema<IAddress>({
  type: { 
    type: String, 
    enum: ['home', 'work', 'other'], 
    required: true 
  },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'United States' },
  isDefault: { type: Boolean, default: false },
});

const UserPreferencesSchema = new Schema<IUserPreferences>({
  newsletter: { type: Boolean, default: true },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
  },
  currency: { type: String, default: 'USD' },
  language: { type: String, default: 'en' },
});

const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId as any,
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
    protection: String,
  },
  addedAt: { type: Date, default: Date.now },
});

// Main User Schema
const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true, 
    maxlength: 50,
    trim: true,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
  },
  phone: { 
    type: String,
    trim: true,
  },
  role: { 
    type: String, 
    enum: ['customer', 'support', 'manager', 'admin'], 
    default: 'customer',
  },
  avatar: String,
  addresses: [AddressSchema],
  preferences: { 
    type: UserPreferencesSchema, 
    default: () => ({
      newsletter: true,
      notifications: { email: true, sms: false },
      currency: 'USD',
      language: 'en',
    }),
  },
  wishlist: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  cart: [CartItemSchema],
  loyaltyPoints: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
}, {
  timestamps: true,
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ emailVerified: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to check password
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to update last login
UserSchema.methods.updateLastLogin = async function(): Promise<IUser> {
  this.lastLogin = new Date();
  return await this.save();
};

// Instance method to add to wishlist
UserSchema.methods.addToWishlist = async function(productId: string): Promise<IUser> {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
    await this.save();
  }
  return this as unknown as IUser;
};

// Instance method to remove from wishlist
UserSchema.methods.removeFromWishlist = async function(productId: string): Promise<IUser> {
  this.wishlist = this.wishlist.filter((id: any) => id.toString() !== productId);
  return await this.save();
};

// Instance method to add to cart
UserSchema.methods.addToCart = async function(
  productId: string, 
  quantity: number, 
  customization?: any
): Promise<IUser> {
  // Check if item already exists in cart with same customization
  const existingItemIndex = this.cart.findIndex((item: any) =>
    item.product.toString() === productId &&
    JSON.stringify(item.customization) === JSON.stringify(customization)
  );

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    this.cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    this.cart.push({
      product: productId,
      quantity,
      customization,
      addedAt: new Date(),
    });
  }

  return await this.save();
};

// Instance method to remove from cart
UserSchema.methods.removeFromCart = async function(itemId: string): Promise<IUser> {
  this.cart = this.cart.filter((item: any) => item._id?.toString() !== itemId);
  return await this.save();
};

// Instance method to update cart quantity
UserSchema.methods.updateCartQuantity = async function(
  itemId: string, 
  quantity: number
): Promise<IUser> {
  const item = this.cart.find((item: any) => item._id?.toString() === itemId);
  if (item) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    } else {
      item.quantity = quantity;
      await this.save();
    }
  }
  return this as unknown as IUser;
};

// Instance method to clear cart
UserSchema.methods.clearCart = async function(): Promise<IUser> {
  this.cart = [];
  return await this.save();
};

// Instance method to get cart total
UserSchema.methods.getCartTotal = async function(): Promise<number> {
  await this.populate('cart.product');

  return this.cart.reduce((total: any, item: any) => {
    const product = item.product as any;
    if (product && product.basePrice) {
      return total + (product.basePrice * item.quantity);
    }
    return total;
  }, 0);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject() as any;
  userObject.id = userObject._id.toString();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpire;
  return userObject;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
