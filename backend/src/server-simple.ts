import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxehome');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Simple Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: String,
  basePrice: { type: Number, required: true },
  originalPrice: Number,
  images: [String],
  materials: [String],
  colors: [String],
  features: [String],
  customizationSections: [{
    id: String,
    title: String,
    description: String,
    required: { type: Boolean, default: false },
    type: { type: String, enum: ['single', 'multiple'] },
    options: [{
      id: String,
      name: String,
      price: { type: Number, default: 0 },
      description: String,
      available: { type: Boolean, default: true }
    }]
  }],
  inventory: {
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['draft', 'active', 'inactive'], default: 'active' },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Authentication Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      featured,
      bestseller,
      newArrival,
      search,
      minPrice,
      maxPrice,
      materials,
      colors,
      sortBy = 'createdAt'
    } = req.query;

    const query: any = { status: 'active' };

    // Category filter - support multiple categories separated by comma
    if (category) {
      const categories = category.toString().split(',');
      query.category = { $in: categories };
    }

    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;
    if (newArrival === 'true') query.newArrival = true;

    // Price range filter
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    // Materials filter
    if (materials) {
      const materialList = materials.toString().split(',');
      query.materials = { $in: materialList };
    }

    // Colors filter
    if (colors) {
      const colorList = colors.toString().split(',');
      query.colors = { $in: colorList };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    switch (sortBy) {
      case 'price-low':
        sortOptions = { basePrice: 1 };
        break;
      case 'price-high':
        sortOptions = { basePrice: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'featured':
        sortOptions = { featured: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOptions);

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: {
        items: products,
        pagination: {
          current: Number(page),
          pages,
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({
      status: 'active',
      featured: true
    }).limit(6);

    res.json({
      success: true,
      data: {
        items: products,
        pagination: {
          current: 1,
          pages: 1,
          total: products.length,
          limit: 6
        }
      }
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get filter options
app.get('/api/products/filters', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    const materials = await Product.distinct('materials', { status: 'active' });
    const colors = await Product.distinct('colors', { status: 'active' });
    const brands = await Product.distinct('brand', { status: 'active' });

    // Get price range
    const priceRange = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$basePrice' },
          maxPrice: { $max: '$basePrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.filter(Boolean),
        materials: materials.flat().filter(Boolean),
        colors: colors.flat().filter(Boolean),
        brands: brands.filter(Boolean),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 5000 }
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const searchQuery = {
      status: 'active',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(searchQuery)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(searchQuery);
    const pages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: {
        items: products,
        pagination: {
          current: Number(page),
          pages,
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Seed products endpoint
app.post('/api/seed-products', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Sample products
    const sampleProducts = [
      {
        name: 'Velvet Accent Chair',
        slug: 'velvet-accent-chair',
        description: 'Luxurious velvet accent chair with solid hardwood frame and premium cushioning.',
        shortDescription: 'Elegant velvet chair with hardwood frame',
        brand: 'LuxeHome',
        category: 'chairs',
        subcategory: 'accent-chairs',
        basePrice: 899,
        originalPrice: 1199,
        images: [
          'https://images.pexels.com/photos/586767/pexels-photo-586767.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        materials: ['Premium Velvet', 'Hardwood'],
        colors: ['Navy', 'Emerald', 'Blush'],
        features: ['Premium cushioning', 'Solid hardwood frame', 'Easy assembly'],
        customizationSections: [
          {
            id: 'color',
            title: 'Choose Color',
            description: 'Select your preferred color',
            required: true,
            type: 'single',
            options: [
              { id: 'navy', name: 'Navy Blue', price: 0, description: 'Classic navy blue velvet', available: true },
              { id: 'emerald', name: 'Emerald Green', price: 50, description: 'Rich emerald green velvet', available: true },
              { id: 'blush', name: 'Blush Pink', price: 25, description: 'Soft blush pink velvet', available: true }
            ]
          },
          {
            id: 'assembly',
            title: 'Assembly Service',
            description: 'Professional assembly service',
            required: false,
            type: 'single',
            options: [
              { id: 'self', name: 'Self Assembly', price: 0, description: 'Assembly instructions included', available: true },
              { id: 'professional', name: 'Professional Assembly', price: 149, description: 'We assemble it for you', available: true }
            ]
          }
        ],
        inventory: { quantity: 25, reserved: 0 },
        rating: { average: 4.8, count: 124 },
        status: 'active',
        featured: true,
        bestseller: true,
        onSale: true
      },
      {
        name: 'Scandinavian Dining Table',
        slug: 'scandinavian-dining-table',
        description: 'Minimalist solid oak dining table with clean lines and sustainable finish.',
        shortDescription: 'Solid oak dining table with clean lines',
        brand: 'LuxeHome',
        category: 'tables',
        subcategory: 'dining-tables',
        basePrice: 1299,
        images: ['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600'],
        materials: ['Solid Oak'],
        colors: ['Natural Oak', 'Walnut'],
        features: ['Sustainable finish', 'Seats 6', 'Easy assembly'],
        customizationSections: [
          {
            id: 'finish',
            title: 'Wood Finish',
            description: 'Choose your preferred wood finish',
            required: true,
            type: 'single',
            options: [
              { id: 'natural', name: 'Natural Oak', price: 0, description: 'Natural oak finish', available: true },
              { id: 'walnut', name: 'Walnut Stain', price: 100, description: 'Rich walnut stain', available: true }
            ]
          }
        ],
        inventory: { quantity: 15, reserved: 0 },
        rating: { average: 4.9, count: 87 },
        status: 'active',
        featured: true,
        newArrival: true
      },
      {
        name: 'Modern Sectional Sofa',
        slug: 'modern-sectional-sofa',
        description: 'Contemporary L-shaped sectional with premium fabric and modular design.',
        shortDescription: 'L-shaped sectional with premium fabric',
        brand: 'LuxeHome',
        category: 'sofas',
        subcategory: 'sectionals',
        basePrice: 2199,
        originalPrice: 2799,
        images: [
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        materials: ['Performance Fabric', 'Steel Frame'],
        colors: ['Charcoal', 'Cream', 'Navy'],
        features: ['Modular design', 'Premium fabric', 'Steel frame'],
        customizationSections: [
          {
            id: 'fabric',
            title: 'Fabric Color',
            description: 'Select your preferred fabric color',
            required: true,
            type: 'single',
            options: [
              { id: 'charcoal', name: 'Charcoal Gray', price: 0, description: 'Classic charcoal gray', available: true },
              { id: 'cream', name: 'Cream White', price: 75, description: 'Elegant cream white', available: true },
              { id: 'navy', name: 'Navy Blue', price: 50, description: 'Deep navy blue', available: true }
            ]
          },
          {
            id: 'configuration',
            title: 'Configuration',
            description: 'Choose your sectional configuration',
            required: true,
            type: 'single',
            options: [
              { id: 'left', name: 'Left Chaise', price: 0, description: 'Chaise on the left side', available: true },
              { id: 'right', name: 'Right Chaise', price: 0, description: 'Chaise on the right side', available: true }
            ]
          }
        ],
        inventory: { quantity: 8, reserved: 0 },
        rating: { average: 4.7, count: 203 },
        status: 'active',
        featured: true,
        bestseller: true,
        onSale: true
      },
      {
        name: 'Executive Office Desk',
        slug: 'executive-office-desk',
        description: 'Premium executive desk with built-in storage and cable management.',
        shortDescription: 'Executive desk with storage',
        brand: 'LuxeHome',
        category: 'office',
        subcategory: 'desks',
        basePrice: 1599,
        originalPrice: 1999,
        images: [
          'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        materials: ['Solid Wood', 'Metal Hardware'],
        colors: ['Walnut', 'Oak'],
        features: ['Built-in storage', 'Cable management', 'Adjustable height'],
        customizationSections: [
          {
            id: 'wood',
            title: 'Wood Type',
            description: 'Choose your preferred wood finish',
            required: true,
            type: 'single',
            options: [
              { id: 'walnut', name: 'Walnut', price: 0, description: 'Rich walnut finish', available: true },
              { id: 'oak', name: 'Oak', price: 200, description: 'Classic oak finish', available: true }
            ]
          }
        ],
        inventory: { quantity: 12, reserved: 0 },
        rating: { average: 4.6, count: 89 },
        status: 'active',
        featured: false,
        bestseller: false,
        onSale: true
      },
      {
        name: 'Luxury King Bed Frame',
        slug: 'luxury-king-bed-frame',
        description: 'Elegant upholstered king bed frame with premium fabric headboard.',
        shortDescription: 'Upholstered king bed frame',
        brand: 'LuxeHome',
        category: 'bedroom',
        subcategory: 'beds',
        basePrice: 2299,
        images: [
          'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        materials: ['Premium Fabric', 'Solid Wood'],
        colors: ['Charcoal', 'Beige', 'Navy'],
        features: ['Upholstered headboard', 'Solid wood frame', 'Easy assembly'],
        customizationSections: [
          {
            id: 'fabric',
            title: 'Headboard Fabric',
            description: 'Select headboard fabric color',
            required: true,
            type: 'single',
            options: [
              { id: 'charcoal', name: 'Charcoal Gray', price: 0, description: 'Modern charcoal gray', available: true },
              { id: 'beige', name: 'Warm Beige', price: 100, description: 'Warm beige fabric', available: true },
              { id: 'navy', name: 'Navy Blue', price: 150, description: 'Deep navy blue', available: true }
            ]
          }
        ],
        inventory: { quantity: 6, reserved: 0 },
        rating: { average: 4.8, count: 156 },
        status: 'active',
        featured: true,
        bestseller: false,
        onSale: false
      },
      {
        name: 'Glass Coffee Table',
        slug: 'glass-coffee-table',
        description: 'Modern tempered glass coffee table with chrome legs.',
        shortDescription: 'Modern glass coffee table',
        brand: 'LuxeHome',
        category: 'tables',
        subcategory: 'coffee-tables',
        basePrice: 699,
        originalPrice: 899,
        images: [
          'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        materials: ['Tempered Glass', 'Chrome'],
        colors: ['Clear', 'Smoked'],
        features: ['Tempered glass top', 'Chrome legs', 'Modern design'],
        customizationSections: [
          {
            id: 'glass',
            title: 'Glass Type',
            description: 'Choose glass finish',
            required: true,
            type: 'single',
            options: [
              { id: 'clear', name: 'Clear Glass', price: 0, description: 'Crystal clear glass', available: true },
              { id: 'smoked', name: 'Smoked Glass', price: 100, description: 'Elegant smoked glass', available: true }
            ]
          }
        ],
        inventory: { quantity: 20, reserved: 0 },
        rating: { average: 4.4, count: 78 },
        status: 'active',
        featured: false,
        bestseller: false,
        onSale: true
      },
      {
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'Professional ergonomic office chair with lumbar support and adjustable features.',
        shortDescription: 'Ergonomic office chair with lumbar support',
        brand: 'LuxeHome',
        category: 'chairs',
        subcategory: 'office-chairs',
        basePrice: 799,
        originalPrice: 999,
        images: [
          'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        materials: ['Mesh', 'Aluminum'],
        colors: ['Black', 'Gray'],
        features: ['Lumbar support', 'Adjustable height', 'Breathable mesh'],
        customizationSections: [
          {
            id: 'color',
            title: 'Chair Color',
            description: 'Select chair color',
            required: true,
            type: 'single',
            options: [
              { id: 'black', name: 'Black', price: 0, description: 'Classic black finish', available: true },
              { id: 'gray', name: 'Gray', price: 50, description: 'Modern gray finish', available: true }
            ]
          }
        ],
        inventory: { quantity: 30, reserved: 0 },
        rating: { average: 4.7, count: 234 },
        status: 'active',
        featured: true,
        bestseller: true,
        onSale: true
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    
    res.json({
      success: true,
      message: `Seeded ${products.length} products successfully`,
      data: products
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Seed users endpoint
app.post('/api/seed-users', async (req, res) => {
  try {
    // Clear existing users
    await User.deleteMany({});

    const sampleUsers = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@luxehome.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1-555-0001',
        address: {
          street: '123 Admin Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'user123',
        role: 'user',
        phone: '+1-555-0002',
        address: {
          street: '456 User Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        }
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'user123',
        role: 'user',
        phone: '+1-555-0003',
        address: {
          street: '789 Customer Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        }
      }
    ];

    const users = await User.insertMany(sampleUsers);

    res.json({
      success: true,
      message: `Seeded ${users.length} users successfully`,
      data: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch(console.error);
