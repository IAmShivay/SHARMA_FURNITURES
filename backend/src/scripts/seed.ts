import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import BlogPost from '../models/BlogPost';

// ─── Users ────────────────────────────────────────────────────────────────────

const users = [
  {
    name: 'Admin User',
    email: 'admin@luxehome.com',
    password: 'Admin@1234',
    role: 'admin',
    phone: '+1-555-100-0001',
    emailVerified: true,
    isActive: true,
    addresses: [
      {
        type: 'work',
        street: '123 Design Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Test Customer',
    email: 'customer@test.com',
    password: 'Customer@1234',
    role: 'customer',
    phone: '+1-555-200-0002',
    emailVerified: true,
    isActive: true,
    addresses: [
      {
        type: 'home',
        street: '456 Oak Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Support Agent',
    email: 'support@luxehome.com',
    password: 'Support@1234',
    role: 'support',
    emailVerified: true,
    isActive: true,
  },
  {
    name: 'Store Manager',
    email: 'manager@luxehome.com',
    password: 'Manager@1234',
    role: 'manager',
    emailVerified: true,
    isActive: true,
  },
];

// ─── Customization sections (shared across products) ──────────────────────────

const woodCustomization = {
  id: 'wood-type',
  title: 'Wood Type',
  description: 'Choose your preferred wood',
  required: true,
  type: 'single' as const,
  options: [
    { id: 'oak', name: 'Oak', price: 0, description: 'Classic and durable', available: true },
    { id: 'walnut', name: 'Walnut', price: 199, description: 'Rich dark tones', available: true },
    { id: 'mahogany', name: 'Mahogany', price: 399, description: 'Premium reddish-brown', available: true },
    { id: 'teak', name: 'Teak', price: 699, description: 'Weather-resistant luxury', available: true },
  ],
};

const finishCustomization = {
  id: 'finish-type',
  title: 'Finish',
  description: 'Select a finish for your furniture',
  required: true,
  type: 'single' as const,
  options: [
    { id: 'natural', name: 'Natural', price: 0, description: 'Uncoated natural look', available: true },
    { id: 'satin', name: 'Satin', price: 99, description: 'Smooth low-sheen finish', available: true },
    { id: 'gloss', name: 'Gloss', price: 149, description: 'High-shine reflective', available: true },
    { id: 'distressed', name: 'Distressed', price: 249, description: 'Vintage weathered look', available: true },
  ],
};

const colorCustomization = {
  id: 'color-option',
  title: 'Color',
  description: 'Pick a color stain',
  required: true,
  type: 'single' as const,
  options: [
    { id: 'natural-brown', name: 'Natural Brown', price: 0, available: true },
    { id: 'espresso', name: 'Espresso', price: 99, available: true },
    { id: 'honey', name: 'Honey', price: 79, available: true },
    { id: 'white-wash', name: 'White Wash', price: 129, available: true },
    { id: 'ebony-black', name: 'Ebony Black', price: 199, available: true },
  ],
};

const assemblyCustomization = {
  id: 'assembly-option',
  title: 'Assembly',
  description: 'Choose your assembly option',
  required: true,
  type: 'single' as const,
  options: [
    { id: 'diy', name: 'DIY Assembly', price: 0, description: 'Includes tools and instructions', available: true },
    { id: 'basic', name: 'Basic Assembly', price: 149, description: 'Standard setup included', available: true },
    { id: 'white-glove', name: 'White Glove', price: 299, description: 'Full setup, packaging removed', available: true },
  ],
};

const hardwareCustomization = {
  id: 'hardware-upgrades',
  title: 'Hardware Upgrades',
  description: 'Optional premium hardware',
  required: false,
  type: 'multiple' as const,
  options: [
    { id: 'soft-close', name: 'Soft-Close Hinges', price: 89, available: true },
    { id: 'premium-handles', name: 'Premium Handles', price: 129, available: true },
    { id: 'led-lighting', name: 'LED Interior Lighting', price: 199, available: true },
  ],
};

const protectionCustomization = {
  id: 'protection-plan',
  title: 'Protection Plan',
  description: 'Extended warranty coverage',
  required: false,
  type: 'single' as const,
  options: [
    { id: 'none', name: 'No Protection', price: 0, available: true },
    { id: '2-year', name: '2-Year Plan', price: 199, description: 'Covers defects & damage', available: true },
    { id: '5-year', name: '5-Year Plan', price: 399, description: 'Full coverage including stains', available: true },
    { id: 'lifetime', name: 'Lifetime Plan', price: 699, description: 'Lifetime peace of mind', available: true },
  ],
};

// ─── Products ─────────────────────────────────────────────────────────────────

function buildProducts(adminId: mongoose.Types.ObjectId) {
  return [
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
      images: [
        'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '32"', width: '30"', height: '35"', weight: '45 lbs', unit: 'inches' },
      materials: ['Premium Velvet', 'Hardwood'],
      colors: ['Navy', 'Emerald', 'Blush'],
      styles: ['Modern', 'Contemporary'],
      features: ['Premium cushioning', 'Solid hardwood frame', 'Easy assembly'],
      specifications: [
        { name: 'Material', value: 'Premium Velvet & Hardwood' },
        { name: 'Dimensions', value: '32"W x 30"D x 35"H' },
        { name: 'Weight', value: '45 lbs' },
      ],
      customization: [woodCustomization, finishCustomization, colorCustomization, assemblyCustomization, protectionCustomization],
      inventory: { quantity: 25, reserved: 0, lowStockThreshold: 5, trackInventory: true },
      shipping: { weight: 45, dimensions: { length: 32, width: 30, height: 35 }, freeShipping: true, shippingClass: 'standard' },
      status: 'active',
      featured: true,
      bestseller: true,
      newArrival: false,
      onSale: true,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      name: 'Scandinavian Dining Table',
      slug: 'scandinavian-dining-table',
      description: 'Minimalist solid oak dining table with clean lines and sustainable finish. Seats 6 comfortably. Handcrafted with care.',
      shortDescription: 'Solid oak dining table with clean lines',
      brand: 'LuxeHome',
      category: 'tables',
      subcategory: 'dining-tables',
      tags: ['eco-friendly', 'handcrafted', 'oak'],
      basePrice: 1299,
      costPrice: 650,
      images: [
        'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '72"', width: '36"', height: '30"', weight: '85 lbs', unit: 'inches' },
      materials: ['Solid Oak'],
      colors: ['Natural Oak', 'Walnut'],
      styles: ['Scandinavian', 'Minimalist'],
      features: ['Sustainable finish', 'Seats 6', 'Easy assembly'],
      specifications: [
        { name: 'Material', value: 'Solid Oak' },
        { name: 'Dimensions', value: '72"L x 36"W x 30"H' },
        { name: 'Weight', value: '85 lbs' },
      ],
      customization: [woodCustomization, finishCustomization, colorCustomization, assemblyCustomization, hardwareCustomization, protectionCustomization],
      inventory: { quantity: 15, reserved: 0, lowStockThreshold: 3, trackInventory: true },
      shipping: { weight: 85, dimensions: { length: 72, width: 36, height: 30 }, freeShipping: true, shippingClass: 'white-glove' },
      status: 'active',
      featured: true,
      bestseller: false,
      newArrival: true,
      onSale: false,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      name: 'Modern Sectional Sofa',
      slug: 'modern-sectional-sofa',
      description: 'Contemporary L-shaped sectional with premium fabric and modular design. Perfect for large living spaces. Reversible chaise.',
      shortDescription: 'L-shaped sectional with premium fabric',
      brand: 'LuxeHome',
      category: 'sofas',
      subcategory: 'sectionals',
      tags: ['bestseller', 'modular', 'premium'],
      basePrice: 2199,
      originalPrice: 2799,
      costPrice: 1100,
      images: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '108"', width: '75"', height: '32"', weight: '180 lbs', unit: 'inches' },
      materials: ['Performance Fabric', 'Steel Frame'],
      colors: ['Charcoal', 'Cream', 'Navy'],
      styles: ['Modern', 'Contemporary'],
      features: ['Modular design', 'Premium fabric', 'Steel frame', 'Reversible chaise'],
      specifications: [
        { name: 'Material', value: 'Performance Fabric & Steel Frame' },
        { name: 'Dimensions', value: '108"L x 75"W x 32"H' },
        { name: 'Weight', value: '180 lbs' },
      ],
      customization: [finishCustomization, colorCustomization, assemblyCustomization, protectionCustomization],
      inventory: { quantity: 8, reserved: 0, lowStockThreshold: 2, trackInventory: true },
      shipping: { weight: 180, dimensions: { length: 108, width: 75, height: 32 }, freeShipping: true, shippingClass: 'white-glove' },
      status: 'active',
      featured: true,
      bestseller: true,
      newArrival: false,
      onSale: true,
      createdBy: adminId,
      updatedBy: adminId,
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
      images: [
        'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '26"', width: '26"', height: '42"', weight: '35 lbs', unit: 'inches' },
      materials: ['Premium Leather', 'Mesh'],
      colors: ['Black', 'Brown', 'White'],
      styles: ['Professional', 'Modern'],
      features: ['Adjustable height', 'Lumbar support', 'Ergonomic design'],
      specifications: [
        { name: 'Material', value: 'Premium Leather & Mesh' },
        { name: 'Features', value: 'Adjustable Height, Lumbar Support' },
        { name: 'Weight', value: '35 lbs' },
      ],
      customization: [colorCustomization, assemblyCustomization, protectionCustomization],
      inventory: { quantity: 20, reserved: 0, lowStockThreshold: 5, trackInventory: true },
      shipping: { weight: 35, dimensions: { length: 26, width: 26, height: 42 }, freeShipping: true, shippingClass: 'standard' },
      status: 'active',
      featured: false,
      bestseller: false,
      newArrival: false,
      onSale: true,
      createdBy: adminId,
      updatedBy: adminId,
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
      images: [
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '48"', width: '24"', height: '18"', weight: '55 lbs', unit: 'inches' },
      materials: ['Tempered Glass', 'Steel'],
      colors: ['Clear', 'Smoked'],
      styles: ['Modern', 'Minimalist'],
      features: ['Tempered glass', 'Brushed steel frame', 'Easy assembly'],
      specifications: [
        { name: 'Material', value: 'Tempered Glass & Steel' },
        { name: 'Dimensions', value: '48"L x 24"W x 18"H' },
        { name: 'Weight', value: '55 lbs' },
      ],
      customization: [finishCustomization, assemblyCustomization, protectionCustomization],
      inventory: { quantity: 12, reserved: 0, lowStockThreshold: 3, trackInventory: true },
      shipping: { weight: 55, dimensions: { length: 48, width: 24, height: 18 }, freeShipping: false, shippingClass: 'standard' },
      status: 'active',
      featured: false,
      bestseller: false,
      newArrival: true,
      onSale: false,
      createdBy: adminId,
      updatedBy: adminId,
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
      images: [
        'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '36"', width: '12"', height: '72"', weight: '75 lbs', unit: 'inches' },
      materials: ['Reclaimed Wood', 'Steel'],
      colors: ['Natural', 'Dark Walnut'],
      styles: ['Industrial', 'Vintage'],
      features: ['Five tiers', 'Reclaimed wood', 'Steel construction'],
      specifications: [
        { name: 'Material', value: 'Reclaimed Wood & Steel' },
        { name: 'Dimensions', value: '72"H x 36"W x 12"D' },
        { name: 'Weight', value: '75 lbs' },
      ],
      customization: [woodCustomization, finishCustomization, colorCustomization, assemblyCustomization, hardwareCustomization, protectionCustomization],
      inventory: { quantity: 10, reserved: 0, lowStockThreshold: 2, trackInventory: true },
      shipping: { weight: 75, dimensions: { length: 36, width: 12, height: 72 }, freeShipping: true, shippingClass: 'standard' },
      status: 'active',
      featured: false,
      bestseller: false,
      newArrival: false,
      onSale: false,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      name: 'Luxury King Bed Frame',
      slug: 'luxury-king-bed-frame',
      description: 'Stunning upholstered king bed frame with tufted headboard. Premium linen fabric and solid wood slats for ultimate comfort.',
      shortDescription: 'Upholstered king bed with tufted headboard',
      brand: 'LuxeHome',
      category: 'bedroom',
      subcategory: 'beds',
      tags: ['luxury', 'premium', 'bedroom'],
      basePrice: 1899,
      originalPrice: 2399,
      costPrice: 950,
      images: [
        'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '86"', width: '80"', height: '55"', weight: '120 lbs', unit: 'inches' },
      materials: ['Linen Fabric', 'Solid Wood'],
      colors: ['Grey', 'Beige', 'Navy'],
      styles: ['Luxury', 'Contemporary'],
      features: ['Tufted headboard', 'Solid wood slats', 'No box spring needed'],
      specifications: [
        { name: 'Material', value: 'Premium Linen & Solid Wood' },
        { name: 'Size', value: 'King (76" x 80")' },
        { name: 'Weight Capacity', value: '800 lbs' },
      ],
      customization: [woodCustomization, finishCustomization, colorCustomization, assemblyCustomization, protectionCustomization],
      inventory: { quantity: 6, reserved: 0, lowStockThreshold: 2, trackInventory: true },
      shipping: { weight: 120, dimensions: { length: 86, width: 80, height: 55 }, freeShipping: true, shippingClass: 'white-glove' },
      status: 'active',
      featured: true,
      bestseller: false,
      newArrival: true,
      onSale: true,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      name: 'Pendant Chandelier Light',
      slug: 'pendant-chandelier-light',
      description: 'Modern pendant chandelier with brushed brass finish and frosted glass shades. Creates warm ambient lighting for dining rooms.',
      shortDescription: 'Brushed brass chandelier with glass shades',
      brand: 'LuxeHome',
      category: 'lighting',
      subcategory: 'chandeliers',
      tags: ['modern', 'brass', 'lighting'],
      basePrice: 459,
      costPrice: 230,
      images: [
        'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '24"', width: '24"', height: '18"', weight: '12 lbs', unit: 'inches' },
      materials: ['Brass', 'Frosted Glass'],
      colors: ['Brushed Brass', 'Matte Black'],
      styles: ['Modern', 'Art Deco'],
      features: ['Dimmable', 'E26 bulb base', 'Adjustable chain'],
      specifications: [
        { name: 'Material', value: 'Brass & Frosted Glass' },
        { name: 'Bulbs', value: '5 x E26 (not included)' },
        { name: 'Chain Length', value: '60" adjustable' },
      ],
      customization: [assemblyCustomization],
      inventory: { quantity: 18, reserved: 0, lowStockThreshold: 4, trackInventory: true },
      shipping: { weight: 12, dimensions: { length: 24, width: 24, height: 18 }, freeShipping: false, shippingClass: 'standard' },
      status: 'active',
      featured: false,
      bestseller: false,
      newArrival: true,
      onSale: false,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      name: 'Marble Console Table',
      slug: 'marble-console-table',
      description: 'Elegant Italian marble top console table with gold-finished steel legs. A statement piece for entryways and living rooms.',
      shortDescription: 'Italian marble console with gold legs',
      brand: 'LuxeHome',
      category: 'tables',
      subcategory: 'console-tables',
      tags: ['luxury', 'marble', 'gold'],
      basePrice: 1599,
      costPrice: 800,
      images: [
        'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '48"', width: '14"', height: '32"', weight: '65 lbs', unit: 'inches' },
      materials: ['Italian Marble', 'Steel'],
      colors: ['White Marble', 'Black Marble'],
      styles: ['Luxury', 'Contemporary'],
      features: ['Genuine marble', 'Gold-finished legs', 'Anti-scratch pads'],
      specifications: [
        { name: 'Material', value: 'Italian Marble & Steel' },
        { name: 'Finish', value: 'Gold electroplated' },
        { name: 'Weight', value: '65 lbs' },
      ],
      customization: [finishCustomization, assemblyCustomization, protectionCustomization],
      inventory: { quantity: 7, reserved: 0, lowStockThreshold: 2, trackInventory: true },
      shipping: { weight: 65, dimensions: { length: 48, width: 14, height: 32 }, freeShipping: true, shippingClass: 'white-glove' },
      status: 'active',
      featured: true,
      bestseller: false,
      newArrival: false,
      onSale: false,
      createdBy: adminId,
      updatedBy: adminId,
    },
    {
      name: 'Ceramic Table Lamp Set',
      slug: 'ceramic-table-lamp-set',
      description: 'Set of 2 handcrafted ceramic table lamps with linen shades. Textured glaze finish adds character to any nightstand or side table.',
      shortDescription: 'Set of 2 handcrafted ceramic lamps',
      brand: 'LuxeHome',
      category: 'decor',
      subcategory: 'table-lamps',
      tags: ['handcrafted', 'ceramic', 'set'],
      basePrice: 349,
      originalPrice: 449,
      costPrice: 175,
      images: [
        'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      dimensions: { length: '12"', width: '12"', height: '24"', weight: '8 lbs', unit: 'inches' },
      materials: ['Ceramic', 'Linen'],
      colors: ['Ivory', 'Sage Green', 'Terracotta'],
      styles: ['Bohemian', 'Modern'],
      features: ['Set of 2', 'Handcrafted', '3-way switch'],
      specifications: [
        { name: 'Material', value: 'Ceramic base, Linen shade' },
        { name: 'Bulb', value: 'E26 (not included)' },
        { name: 'Quantity', value: 'Set of 2' },
      ],
      customization: [protectionCustomization],
      inventory: { quantity: 30, reserved: 0, lowStockThreshold: 8, trackInventory: true },
      shipping: { weight: 8, dimensions: { length: 12, width: 12, height: 24 }, freeShipping: false, shippingClass: 'standard' },
      status: 'active',
      featured: false,
      bestseller: true,
      newArrival: false,
      onSale: true,
      createdBy: adminId,
      updatedBy: adminId,
    },
  ];
}

// ─── Blog Posts ────────────────────────────────────────────────────────────────

function buildBlogPosts(authorId: mongoose.Types.ObjectId) {
  return [
    {
      title: 'How to Choose the Perfect Sofa for Your Living Room',
      content: `Choosing the right sofa is one of the most important decisions you'll make for your living room. It's where you'll relax, entertain guests, and spend quality time with family.\n\n## Consider Your Space\nMeasure your room carefully before shopping. A sectional might seem perfect, but if your room can't accommodate it, you'll regret the purchase.\n\n## Material Matters\nPerformance fabrics are ideal for families with kids or pets. Leather develops a beautiful patina over time. Velvet adds luxury but requires more care.\n\n## Test Before You Buy\nAlways sit on a sofa before purchasing. Check the seat depth, firmness, and back support. A sofa should feel comfortable after 20 minutes, not just the first 30 seconds.\n\n## Color & Style\nNeutral colors offer the most versatility. You can always add personality with throw pillows and blankets. Consider how the sofa's style complements your existing decor.`,
      excerpt: 'A comprehensive guide to selecting the ideal sofa that matches your lifestyle, space, and design preferences.',
      coverImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: authorId,
      category: 'buying-guides',
      tags: ['sofa', 'living-room', 'buying-guide'],
      status: 'published',
      publishedAt: new Date('2025-06-15'),
      viewCount: 342,
    },
    {
      title: '5 Wood Care Tips Every Furniture Owner Should Know',
      content: `Wood furniture is an investment that can last generations with proper care. Here are five essential tips to keep your pieces looking beautiful.\n\n## 1. Dust Regularly\nUse a soft, lint-free cloth to dust weekly. Microfiber works best as it traps particles instead of pushing them around.\n\n## 2. Avoid Direct Sunlight\nUV rays can fade and dry out wood over time. Use curtains or blinds to protect your furniture from prolonged sun exposure.\n\n## 3. Use Coasters Always\nWater rings are one of the most common forms of damage. Always use coasters under glasses, mugs, and vases.\n\n## 4. Polish Seasonally\nApply quality furniture polish or wax every 3-4 months. This maintains the finish and provides a protective layer.\n\n## 5. Control Humidity\nWood expands and contracts with humidity changes. Keep your home between 40-60% relative humidity for optimal furniture health.`,
      excerpt: 'Essential wood care tips to protect your furniture investment and keep it looking beautiful for decades.',
      coverImage: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: authorId,
      category: 'furniture-care',
      tags: ['wood-care', 'maintenance', 'tips'],
      status: 'published',
      publishedAt: new Date('2025-07-02'),
      viewCount: 187,
    },
    {
      title: 'Interior Design Trends to Watch in 2025',
      content: `The world of interior design is constantly evolving. Here are the trends shaping homes this year.\n\n## Warm Minimalism\nMinimalism isn't going anywhere, but it's getting warmer. Think natural materials, earthy tones, and organic shapes that make spaces feel inviting rather than sterile.\n\n## Curved Furniture\nStraight lines are giving way to soft curves. Rounded sofas, arched mirrors, and circular tables add visual interest and a sense of movement.\n\n## Sustainable Materials\nEco-conscious design continues to grow. Reclaimed wood, recycled metals, and organic fabrics are in high demand.\n\n## Bold Accent Pieces\nWhile base palettes stay neutral, bold accent pieces in jewel tones — emerald, sapphire, amber — make strong statements.\n\n## Multi-Functional Spaces\nWith more people working from home, furniture that serves dual purposes is essential. Think desks that fold away, storage ottomans, and modular seating.`,
      excerpt: 'Discover the hottest interior design trends of 2025, from warm minimalism to sustainable materials.',
      coverImage: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: authorId,
      category: 'trends',
      tags: ['trends', '2025', 'interior-design'],
      status: 'published',
      publishedAt: new Date('2025-08-10'),
      viewCount: 521,
    },
    {
      title: 'DIY: How to Refinish a Wooden Table',
      content: `Give new life to an old table with this step-by-step refinishing guide.\n\n## What You'll Need\n- Sandpaper (80, 150, 220 grit)\n- Tack cloth\n- Wood stain\n- Polyurethane finish\n- Brushes and rags\n\n## Step 1: Sand the Surface\nStart with 80 grit to remove the old finish, then progress to 150 and 220 grit for a smooth surface.\n\n## Step 2: Clean Thoroughly\nWipe down with tack cloth to remove all dust particles. Any debris will show through the new finish.\n\n## Step 3: Apply Stain\nApply stain with a rag in the direction of the grain. Let it sit for 5-10 minutes, then wipe off excess.\n\n## Step 4: Seal It\nApply 2-3 coats of polyurethane, sanding lightly with 220 grit between coats. Allow 24 hours of drying time between each coat.`,
      excerpt: 'A beginner-friendly guide to refinishing wooden furniture at home with professional results.',
      coverImage: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: authorId,
      category: 'diy',
      tags: ['diy', 'refinishing', 'wood'],
      status: 'published',
      publishedAt: new Date('2025-08-25'),
      viewCount: 89,
    },
  ];
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  try {
    await connectDB();
    console.log('Connected to database\n');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      BlogPost.deleteMany({}),
    ]);
    console.log('Cleared all collections');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`  Created ${user.role}: ${user.email}`);
    }
    const [admin, customer, support, manager] = createdUsers;

    // Create products
    const productData = buildProducts(admin._id);
    const products = await Product.insertMany(productData);
    console.log(`\nInserted ${products.length} products`);

    // Create sample orders for the test customer
    const order1 = await Order.create({
      user: customer._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          image: products[0].images[0],
          quantity: 1,
          price: 899,
          customization: {
            woodType: 'Walnut',
            finish: 'Satin',
            color: 'Espresso',
            assembly: 'White Glove',
            protection: '5-Year Plan',
            customizationCost: 946,
          },
        },
      ],
      subtotal: 1845,
      tax: 147.60,
      shipping: { method: 'white_glove', cost: 0, status: 'delivered' },
      total: 1992.60,
      status: 'delivered',
      payment: { method: 'credit_card', status: 'completed', amount: 1992.60, paidAt: new Date('2025-07-15') },
      shippingAddress: {
        name: 'Test Customer',
        street: '456 Oak Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States',
        phone: '+1-555-200-0002',
      },
      timeline: [
        { status: 'pending', timestamp: new Date('2025-07-10'), description: 'Order placed' },
        { status: 'confirmed', timestamp: new Date('2025-07-10'), description: 'Payment confirmed' },
        { status: 'processing', timestamp: new Date('2025-07-11'), description: 'Order is being prepared' },
        { status: 'shipped', timestamp: new Date('2025-07-13'), description: 'Order shipped via White Glove delivery' },
        { status: 'delivered', timestamp: new Date('2025-07-15'), description: 'Delivered successfully' },
      ],
      estimatedDelivery: new Date('2025-07-17'),
    });
    console.log(`  Created order: ${order1.orderNumber} (delivered)`);

    const order2 = await Order.create({
      user: customer._id,
      items: [
        {
          product: products[1]._id,
          name: products[1].name,
          image: products[1].images[0],
          quantity: 1,
          price: 1299,
          customization: {
            woodType: 'Oak',
            finish: 'Natural',
            color: 'Natural Brown',
            assembly: 'Basic Assembly',
            customizationCost: 149,
          },
        },
        {
          product: products[4]._id,
          name: products[4].name,
          image: products[4].images[0],
          quantity: 2,
          price: 599,
          customization: {
            finish: 'Gloss',
            assembly: 'DIY Assembly',
            customizationCost: 149,
          },
        },
      ],
      subtotal: 2795,
      tax: 223.60,
      shipping: { method: 'standard', cost: 0, status: 'in_transit' },
      total: 3018.60,
      status: 'shipped',
      payment: { method: 'credit_card', status: 'completed', amount: 3018.60, paidAt: new Date('2025-08-20') },
      shippingAddress: {
        name: 'Test Customer',
        street: '456 Oak Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States',
        phone: '+1-555-200-0002',
      },
      timeline: [
        { status: 'pending', timestamp: new Date('2025-08-20'), description: 'Order placed' },
        { status: 'confirmed', timestamp: new Date('2025-08-20'), description: 'Payment confirmed' },
        { status: 'processing', timestamp: new Date('2025-08-21'), description: 'Preparing your order' },
        { status: 'shipped', timestamp: new Date('2025-08-25'), description: 'Shipped - tracking #TRK-98765' },
      ],
      estimatedDelivery: new Date('2025-09-05'),
    });
    console.log(`  Created order: ${order2.orderNumber} (shipped)`);

    const order3 = await Order.create({
      user: customer._id,
      items: [
        {
          product: products[6]._id,
          name: products[6].name,
          image: products[6].images[0],
          quantity: 1,
          price: 1899,
          customization: {
            woodType: 'Teak',
            finish: 'Satin',
            color: 'Honey',
            assembly: 'White Glove',
            protection: 'Lifetime Plan',
            customizationCost: 1576,
          },
        },
      ],
      subtotal: 3475,
      tax: 278.00,
      shipping: { method: 'white_glove', cost: 0, status: 'pending' },
      total: 3753.00,
      status: 'confirmed',
      payment: { method: 'credit_card', status: 'completed', amount: 3753.00, paidAt: new Date() },
      shippingAddress: {
        name: 'Test Customer',
        street: '456 Oak Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States',
        phone: '+1-555-200-0002',
      },
      timeline: [
        { status: 'pending', timestamp: new Date(), description: 'Order placed' },
        { status: 'confirmed', timestamp: new Date(), description: 'Payment confirmed' },
      ],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    console.log(`  Created order: ${order3.orderNumber} (confirmed/new)`);

    // Create blog posts
    const blogData = buildBlogPosts(admin._id);
    const blogs = [];
    for (const post of blogData) {
      blogs.push(await BlogPost.create(post));
    }
    console.log(`\nInserted ${blogs.length} blog posts`);

    // Add some products to customer's wishlist
    customer.wishlist = [products[2]._id, products[6]._id, products[8]._id];
    await customer.save();
    console.log('Added 3 items to customer wishlist');

    // Summary
    console.log('\n═══════════════════════════════════════════');
    console.log('  SEED COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════\n');
    console.log('  Test Accounts:');
    console.log('  ─────────────────────────────────────────');
    console.log('  Admin:    admin@luxehome.com    / Admin@1234');
    console.log('  Customer: customer@test.com     / Customer@1234');
    console.log('  Support:  support@luxehome.com  / Support@1234');
    console.log('  Manager:  manager@luxehome.com  / Manager@1234');
    console.log('');
    console.log(`  Products: ${products.length}`);
    console.log('  Orders:   3 (delivered, shipped, confirmed)');
    console.log(`  Blogs:    ${blogs.length}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
