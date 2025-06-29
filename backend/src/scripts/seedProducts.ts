import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import { connectDB } from '../config/database';

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
    materials: ['Performance Fabric', 'Steel Frame'],
    colors: ['Charcoal', 'Cream', 'Navy'],
    styles: ['Modern', 'Contemporary'],
    features: ['Modular design', 'Premium fabric', 'Steel frame'],
    specifications: [
      { name: 'Material', value: 'Performance Fabric & Steel Frame' },
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
    shortDescription: 'Ergonomic chair with premium leather',
    brand: 'LuxeHome',
    category: 'office',
    subcategory: 'office-chairs',
    tags: ['ergonomic', 'professional', 'leather'],
    basePrice: 649,
    originalPrice: 799,
    costPrice: 325,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dimensions: {
      length: '26"',
      width: '26"',
      height: '42"',
      weight: '35 lbs',
      unit: 'inches'
    },
    materials: ['Premium Leather', 'Mesh'],
    colors: ['Black', 'Brown', 'White'],
    styles: ['Professional', 'Modern'],
    features: ['Adjustable height', 'Lumbar support', 'Ergonomic design'],
    specifications: [
      { name: 'Material', value: 'Premium Leather & Mesh' },
      { name: 'Features', value: 'Adjustable Height, Lumbar Support' },
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
  }
];

async function seedProducts() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Create a default admin user if it doesn't exist
    let adminUser = await User.findOne({ email: 'admin@luxehome.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@luxehome.com',
        password: 'admin123',
        role: 'admin',
        emailVerified: true,
        isActive: true
      });
      console.log('Created admin user');
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add createdBy and updatedBy to each product
    const productsWithUser = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id,
      updatedBy: adminUser._id
    }));

    // Insert sample products
    const insertedProducts = await Product.insertMany(productsWithUser);
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
