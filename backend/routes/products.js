const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { auth, hasPermission } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('priceMin').optional().isFloat({ min: 0 }).withMessage('Price minimum must be a positive number'),
  query('priceMax').optional().isFloat({ min: 0 }).withMessage('Price maximum must be a positive number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      priceMin,
      priceMax,
      materials,
      colors,
      styles,
      brands,
      inStock,
      featured,
      onSale,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {
      status: 'active'
    };

    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (featured === 'true') filters.featured = true;
    if (onSale === 'true') filters.onSale = true;
    if (inStock === 'true') filters['inventory.quantity'] = { $gt: 0 };

    // Price range filter
    if (priceMin || priceMax) {
      filters.basePrice = {};
      if (priceMin) filters.basePrice.$gte = parseFloat(priceMin);
      if (priceMax) filters.basePrice.$lte = parseFloat(priceMax);
    }

    // Array filters
    if (materials) {
      const materialArray = Array.isArray(materials) ? materials : [materials];
      filters.materials = { $in: materialArray };
    }

    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      filters.colors = { $in: colorArray };
    }

    if (styles) {
      const styleArray = Array.isArray(styles) ? styles : [styles];
      filters.styles = { $in: styleArray };
    }

    if (brands) {
      const brandArray = Array.isArray(brands) ? brands : [brands];
      filters.brand = { $in: brandArray };
    }

    // Search filter
    if (search) {
      filters.$text = { $search: search };
    }

    // Sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(filters)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments(filters);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({
      status: 'active',
      featured: true
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .select('-__v');

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Featured products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured products'
    });
  }
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q: query, page = 1, limit = 20 } = req.query;

    const products = await Product.find({
      status: 'active',
      $text: { $search: query }
    }, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments({
      status: 'active',
      $text: { $search: query }
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching products'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Manager, Admin)
router.post('/', [
  auth,
  hasPermission('products:create'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Product name is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('category').isIn(['sofas', 'chairs', 'tables', 'storage', 'lighting', 'decor', 'bedroom', 'dining', 'office']).withMessage('Invalid category'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      createdBy: req.user._id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Manager, Admin)
router.put('/:id', [
  auth,
  hasPermission('products:update'),
], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
router.delete('/:id', [
  auth,
  hasPermission('products:delete'),
], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
});

module.exports = router;
