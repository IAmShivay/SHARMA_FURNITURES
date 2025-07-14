// Simple seed script for furniture products (JavaScript version to avoid TypeScript issues)
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furniture');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

// Simple product schema that matches the essential fields
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  tags: [String],
  basePrice: { type: Number, required: true },
  originalPrice: { type: Number },
  costPrice: { type: Number },
  currency: { type: String, default: 'USD' },
  images: [String],
  dimensions: {
    length: String,
    width: String,
    height: String,
    weight: String,
    unit: { type: String, default: 'inches' }
  },
  materials: [String],
  colors: [String],
  styles: [String],
  features: [String],
  specifications: [{
    name: String,
    value: String
  }],
  inventory: {
    quantity: { type: Number, required: true, default: 0 },
    reserved: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    trackInventory: { type: Boolean, default: true }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: { type: Boolean, default: false },
    shippingClass: { type: String, default: 'standard' }
  },
  status: { type: String, default: 'active' },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the model
const Product = mongoose.model('Product', ProductSchema);

// Sample products data
const sampleProducts = [
  {
    name: 'Velvet Accent Chair',
    slug: 'velvet-accent-chair',
    description: 'Luxurious velvet accent chair with solid hardwood frame and premium cushioning. Perfect for adding a touch of elegance to any living space.',
    shortDescription: 'Elegant velvet chair with hardwood frame',
    brand: 'LuxeHome',
    category: 'chairs',
    subcategory: 'accent-chairs',
    tags: ['bestseller', 'premium', 'velvet'],
    basePrice: 899,
    originalPrice: 1199,
    costPrice: 450,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '32"',
      width: '30"',
      height: '35"',
      weight: '45 lbs',
      unit: 'inches'
    },
    materials: ['Premium Velvet', 'Hardwood'],
    colors: ['Navy', 'Emerald', 'Blush'],
    styles: ['Modern', 'Contemporary'],
    features: ['Premium cushioning', 'Solid hardwood frame', 'Easy assembly'],
    specifications: [
      { name: 'Material', value: 'Premium Velvet & Hardwood' },
      { name: 'Dimensions', value: '32"W x 30"D x 35"H' },
      { name: 'Weight', value: '45 lbs' }
    ],
    inventory: {
      quantity: 25,
      reserved: 0,
      lowStockThreshold: 5,
      trackInventory: true
    },
    shipping: {
      weight: 45,
      dimensions: { length: 32, width: 30, height: 35 },
      freeShipping: true,
      shippingClass: 'standard'
    },
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    onSale: true
  },
  {
    name: 'Scandinavian Dining Table',
    slug: 'scandinavian-dining-table',
    description: 'Minimalist solid oak dining table with clean lines and sustainable finish. Seats 6 comfortably.',
    shortDescription: 'Solid oak dining table with clean lines',
    brand: 'LuxeHome',
    category: 'tables',
    subcategory: 'dining-tables',
    tags: ['eco-friendly', 'handcrafted', 'oak'],
    basePrice: 1299,
    costPrice: 650,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '72"',
      width: '36"',
      height: '30"',
      weight: '85 lbs',
      unit: 'inches'
    },
    materials: ['Solid Oak'],
    colors: ['Natural Oak', 'Walnut'],
    styles: ['Scandinavian', 'Minimalist'],
    features: ['Sustainable finish', 'Seats 6', 'Easy assembly'],
    specifications: [
      { name: 'Material', value: 'Solid Oak' },
      { name: 'Dimensions', value: '72"L x 36"W x 30"H' },
      { name: 'Weight', value: '85 lbs' }
    ],
    inventory: {
      quantity: 15,
      reserved: 0,
      lowStockThreshold: 3,
      trackInventory: true
    },
    shipping: {
      weight: 85,
      dimensions: { length: 72, width: 36, height: 30 },
      freeShipping: true,
      shippingClass: 'white-glove'
    },
    status: 'active',
    featured: true,
    bestseller: false,
    newArrival: true,
    onSale: false
  },
  {
    name: 'Modern Sectional Sofa',
    slug: 'modern-sectional-sofa',
    description: 'Contemporary L-shaped sectional with premium fabric and modular design. Perfect for large living spaces.',
    shortDescription: 'L-shaped sectional with premium fabric',
    brand: 'LuxeHome',
    category: 'sofas',
    subcategory: 'sectionals',
    tags: ['bestseller', 'modular', 'premium'],
    basePrice: 2199,
    originalPrice: 2799,
    costPrice: 1100,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '108"',
      width: '75"',
      height: '32"',
      weight: '180 lbs',
      unit: 'inches'
    },
    materials: ['Premium Fabric', 'Hardwood', 'High-Density Foam'],
    colors: ['Gray', 'Beige', 'Blue'],
    styles: ['Modern', 'Contemporary'],
    features: ['Modular design', 'Stain-resistant fabric', 'Reversible configuration'],
    specifications: [
      { name: 'Material', value: 'Premium Fabric & Hardwood' },
      { name: 'Dimensions', value: '108"L x 75"W x 32"H' },
      { name: 'Weight', value: '180 lbs' }
    ],
    inventory: {
      quantity: 8,
      reserved: 0,
      lowStockThreshold: 2,
      trackInventory: true
    },
    shipping: {
      weight: 180,
      dimensions: { length: 108, width: 75, height: 32 },
      freeShipping: true,
      shippingClass: 'white-glove'
    },
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    onSale: true
  },
  {
    name: 'Executive Office Chair',
    slug: 'executive-office-chair',
    description: 'Ergonomic office chair with premium leather and advanced lumbar support. Perfect for long work sessions.',
    shortDescription: 'Ergonomic leather chair with lumbar support',
    brand: 'LuxeHome',
    category: 'chairs',
    subcategory: 'office-chairs',
    tags: ['ergonomic', 'premium', 'leather'],
    basePrice: 799,
    originalPrice: 999,
    costPrice: 400,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '26"',
      width: '26"',
      height: '42"',
      weight: '35 lbs',
      unit: 'inches'
    },
    materials: ['Genuine Leather', 'Aluminum', 'Memory Foam'],
    colors: ['Black', 'Brown', 'White'],
    styles: ['Modern', 'Executive'],
    features: ['Adjustable height', 'Lumbar support', '360° swivel', 'Reclining function'],
    specifications: [
      { name: 'Material', value: 'Genuine Leather & Aluminum' },
      { name: 'Dimensions', value: '26"W x 26"D x 42"H' },
      { name: 'Weight', value: '35 lbs' }
    ],
    inventory: {
      quantity: 20,
      reserved: 0,
      lowStockThreshold: 5,
      trackInventory: true
    },
    shipping: {
      weight: 35,
      dimensions: { length: 26, width: 26, height: 42 },
      freeShipping: true,
      shippingClass: 'standard'
    },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: false,
    onSale: true
  },
  {
    name: 'Glass Coffee Table',
    slug: 'glass-coffee-table',
    description: 'Elegant tempered glass coffee table with brushed steel frame. Modern design perfect for contemporary spaces.',
    shortDescription: 'Tempered glass table with steel frame',
    brand: 'LuxeHome',
    category: 'tables',
    subcategory: 'coffee-tables',
    tags: ['modern', 'minimalist', 'glass'],
    basePrice: 599,
    costPrice: 300,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '48"',
      width: '24"',
      height: '18"',
      weight: '55 lbs',
      unit: 'inches'
    },
    materials: ['Tempered Glass', 'Steel'],
    colors: ['Clear', 'Smoked'],
    styles: ['Modern', 'Minimalist'],
    features: ['Tempered glass', 'Brushed steel frame', 'Easy assembly'],
    specifications: [
      { name: 'Material', value: 'Tempered Glass & Steel' },
      { name: 'Dimensions', value: '48"L x 24"W x 18"H' },
      { name: 'Weight', value: '55 lbs' }
    ],
    inventory: {
      quantity: 12,
      reserved: 0,
      lowStockThreshold: 3,
      trackInventory: true
    },
    shipping: {
      weight: 55,
      dimensions: { length: 48, width: 24, height: 18 },
      freeShipping: false,
      shippingClass: 'standard'
    },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
    onSale: false
  },
  {
    name: 'Industrial Bookshelf',
    slug: 'industrial-bookshelf',
    description: 'Industrial-style bookshelf with reclaimed wood and steel construction. Five tiers for ample storage.',
    shortDescription: 'Industrial bookshelf with reclaimed wood',
    brand: 'LuxeHome',
    category: 'storage',
    subcategory: 'bookcases',
    tags: ['vintage', 'eco-friendly', 'handcrafted'],
    basePrice: 1199,
    costPrice: 600,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '36"',
      width: '12"',
      height: '72"',
      weight: '75 lbs',
      unit: 'inches'
    },
    materials: ['Reclaimed Wood', 'Steel'],
    colors: ['Natural', 'Dark Walnut'],
    styles: ['Industrial', 'Vintage'],
    features: ['Five tiers', 'Reclaimed wood', 'Steel construction'],
    specifications: [
      { name: 'Material', value: 'Reclaimed Wood & Steel' },
      { name: 'Dimensions', value: '72"H x 36"W x 12"D' },
      { name: 'Weight', value: '75 lbs' }
    ],
    inventory: {
      quantity: 10,
      reserved: 0,
      lowStockThreshold: 2,
      trackInventory: true
    },
    shipping: {
      weight: 75,
      dimensions: { length: 36, width: 12, height: 72 },
      freeShipping: true,
      shippingClass: 'standard'
    },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: false,
    onSale: false
  },
  // Additional products
  {
    name: 'Mid-Century Lounge Chair',
    slug: 'mid-century-lounge-chair',
    description: 'Classic mid-century modern lounge chair with ottoman. Features genuine leather upholstery and walnut veneer shell.',
    shortDescription: 'Classic leather lounge chair with ottoman',
    brand: 'LuxeHome',
    category: 'chairs',
    subcategory: 'lounge-chairs',
    tags: ['mid-century', 'premium', 'leather'],
    basePrice: 1499,
    originalPrice: 1899,
    costPrice: 750,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '32"',
      width: '32"',
      height: '31"',
      weight: '65 lbs',
      unit: 'inches'
    },
    materials: ['Genuine Leather', 'Walnut Veneer', 'Aluminum'],
    colors: ['Black', 'Brown', 'White'],
    styles: ['Mid-Century', 'Modern'],
    features: ['Ottoman included', 'Swivel base', 'Premium leather'],
    specifications: [
      { name: 'Material', value: 'Genuine Leather & Walnut Veneer' },
      { name: 'Dimensions', value: '32"W x 32"D x 31"H' },
      { name: 'Weight', value: '65 lbs' }
    ],
    inventory: {
      quantity: 8,
      reserved: 0,
      lowStockThreshold: 2,
      trackInventory: true
    },
    shipping: {
      weight: 65,
      dimensions: { length: 32, width: 32, height: 31 },
      freeShipping: true,
      shippingClass: 'white-glove'
    },
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    onSale: true
  },
  {
    name: 'Marble Top Dining Table',
    slug: 'marble-top-dining-table',
    description: 'Elegant dining table with genuine marble top and brass-finished steel base. Perfect statement piece for modern dining rooms.',
    shortDescription: 'Marble dining table with brass base',
    brand: 'LuxeHome',
    category: 'tables',
    subcategory: 'dining-tables',
    tags: ['luxury', 'marble', 'brass'],
    basePrice: 2499,
    originalPrice: 2999,
    costPrice: 1200,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '72"',
      width: '36"',
      height: '30"',
      weight: '250 lbs',
      unit: 'inches'
    },
    materials: ['Genuine Marble', 'Brass-Finished Steel'],
    colors: ['White Marble', 'Black Marble'],
    styles: ['Modern', 'Luxury'],
    features: ['Genuine marble top', 'Brass-finished base', 'Seats 6-8'],
    specifications: [
      { name: 'Material', value: 'Genuine Marble & Brass-Finished Steel' },
      { name: 'Dimensions', value: '72"L x 36"W x 30"H' },
      { name: 'Weight', value: '250 lbs' }
    ],
    inventory: {
      quantity: 5,
      reserved: 0,
      lowStockThreshold: 2,
      trackInventory: true
    },
    shipping: {
      weight: 250,
      dimensions: { length: 72, width: 36, height: 30 },
      freeShipping: true,
      shippingClass: 'white-glove'
    },
    status: 'active',
    featured: true,
    bestseller: false,
    newArrival: true,
    onSale: true
  },
  {
    name: 'Tufted Linen Bed Frame',
    slug: 'tufted-linen-bed-frame',
    description: 'Luxurious king-size bed frame with tufted linen headboard and solid wood frame. Combines comfort with elegant design.',
    shortDescription: 'King-size bed with tufted linen headboard',
    brand: 'LuxeHome',
    category: 'bedroom',
    subcategory: 'beds',
    tags: ['premium', 'linen', 'tufted'],
    basePrice: 1899,
    originalPrice: 2299,
    costPrice: 950,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '84"',
      width: '80"',
      height: '58"',
      weight: '150 lbs',
      unit: 'inches'
    },
    materials: ['Linen', 'Solid Wood', 'Metal'],
    colors: ['Light Gray', 'Beige', 'Navy'],
    styles: ['Traditional', 'Transitional'],
    features: ['Tufted headboard', 'Solid wood frame', 'Box spring required'],
    specifications: [
      { name: 'Material', value: 'Linen & Solid Wood' },
      { name: 'Dimensions', value: '84"L x 80"W x 58"H' },
      { name: 'Weight', value: '150 lbs' }
    ],
    inventory: {
      quantity: 12,
      reserved: 0,
      lowStockThreshold: 3,
      trackInventory: true
    },
    shipping: {
      weight: 150,
      dimensions: { length: 84, width: 80, height: 58 },
      freeShipping: true,
      shippingClass: 'white-glove'
    },
    status: 'active',
    featured: false,
    bestseller: true,
    newArrival: false,
    onSale: true
  },
  {
    name: 'Walnut Dresser',
    slug: 'walnut-dresser',
    description: 'Six-drawer walnut dresser with brass hardware. Features dovetail joinery and soft-close drawers for quality and convenience.',
    shortDescription: 'Six-drawer walnut dresser with brass hardware',
    brand: 'LuxeHome',
    category: 'bedroom',
    subcategory: 'dressers',
    tags: ['walnut', 'handcrafted', 'storage'],
    basePrice: 1699,
    costPrice: 850,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '60"',
      width: '20"',
      height: '36"',
      weight: '180 lbs',
      unit: 'inches'
    },
    materials: ['Solid Walnut', 'Brass'],
    colors: ['Walnut'],
    styles: ['Mid-Century', 'Modern'],
    features: ['Dovetail joinery', 'Soft-close drawers', 'Brass hardware'],
    specifications: [
      { name: 'Material', value: 'Solid Walnut & Brass' },
      { name: 'Dimensions', value: '60"L x 20"W x 36"H' },
      { name: 'Weight', value: '180 lbs' }
    ],
    inventory: {
      quantity: 8,
      reserved: 0,
      lowStockThreshold: 2,
      trackInventory: true
    },
    shipping: {
      weight: 180,
      dimensions: { length: 60, width: 20, height: 36 },
      freeShipping: true,
      shippingClass: 'white-glove'
    },
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
    onSale: false
  }
];

// Seed function
async function seedProducts() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
