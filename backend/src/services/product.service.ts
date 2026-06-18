import { FilterQuery, SortOrder } from 'mongoose';
import Product from '@/models/Product';
import { IProduct, ProductFilters, PaginatedResponse, ApiResponse } from '@/types';
import { CreateProductInput, UpdateProductInput, AddReviewInput } from '@/validations/product.validation';
import { generateSlug } from '@/utils/helpers';
import { AppError } from '@/utils/AppError';

export class ProductService {
  /**
   * Get all products with filters and pagination
   */
  async getProducts(filters: ProductFilters): Promise<PaginatedResponse<IProduct[]>> {
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
    } = filters;

    // Build filter object
    const query: FilterQuery<IProduct> = {
      status: 'active'
    };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (featured) query.featured = true;
    if (onSale) query.onSale = true;
    if (inStock) query['inventory.quantity'] = { $gt: 0 };

    // Price range filter
    if (priceMin || priceMax) {
      query.basePrice = {};
      if (priceMin) query.basePrice.$gte = priceMin;
      if (priceMax) query.basePrice.$lte = priceMax;
    }

    // Array filters
    if (materials?.length) query.materials = { $in: materials };
    if (colors?.length) query.colors = { $in: colors };
    if (styles?.length) query.styles = { $in: styles };
    if (brands?.length) query.brand = { $in: brands };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Sort object
    const sortObj: { [key: string]: SortOrder } = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(query)
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v')
      .lean();

    const total = await Product.countDocuments(query);

    return {
      success: true,
      data: {
        items: products as IProduct[],
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    };
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: string): Promise<ApiResponse<{ product: IProduct }>> {
    const product = await Product.findById(id)
      .populate('reviews.user', 'name avatar')
      .select('-__v');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Increment view count
    await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return {
      success: true,
      data: { product },
    };
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<{ product: IProduct }>> {
    const product = await Product.findOne({ slug, status: 'active' })
      .populate('reviews.user', 'name avatar')
      .select('-__v');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    return {
      success: true,
      data: { product },
    };
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 12): Promise<ApiResponse<{ items: IProduct[] }>> {
    const products = await Product.find({
      status: 'active',
      featured: true
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();

    return {
      success: true,
      data: { items: products as IProduct[] },
    };
  }

  /**
   * Search products
   */
  async searchProducts(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<IProduct[]>> {
    const products = await Product.find({
      status: 'active',
      $text: { $search: query }
    }, {
      score: { $meta: 'textScore' }
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v')
      .lean();

    const total = await Product.countDocuments({
      status: 'active',
      $text: { $search: query }
    });

    return {
      success: true,
      data: {
        items: products as IProduct[],
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    };
  }

  /**
   * Create new product
   */
  async createProduct(productData: CreateProductInput, createdBy: string): Promise<ApiResponse<IProduct>> {
    // Generate slug from name
    const slug = generateSlug(productData.name);
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      throw new AppError('Product with this name already exists', 400);
    }

    const product = await Product.create({
      ...productData,
      slug,
      createdBy
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: product
    };
  }

  /**
   * Update product
   */
  async updateProduct(id: string, productData: UpdateProductInput, updatedBy: string): Promise<ApiResponse<IProduct>> {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // If name is being updated, generate new slug
    if (productData.name && productData.name !== product.name) {
      const slug = generateSlug(productData.name);
      const existingProduct = await Product.findOne({ slug, _id: { $ne: id } });
      if (existingProduct) {
        throw new AppError('Product with this name already exists', 400);
      }
      productData.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...productData, updatedBy },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct!
    };
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await Product.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  }

  /**
   * Add review to product
   */
  async addReview(productId: string, userId: string, reviewData: AddReviewInput): Promise<ApiResponse<IProduct>> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === userId
    );

    if (existingReview) {
      throw new AppError('You have already reviewed this product', 400);
    }

    // Add review
    const updatedProduct = await product.addReview(
      userId,
      reviewData.rating,
      reviewData.title,
      reviewData.comment,
      reviewData.images
    );

    return {
      success: true,
      message: 'Review added successfully',
      data: updatedProduct
    };
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<ApiResponse<any[]>> {
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          subcategories: { $addToSet: '$subcategory' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      success: true,
      data: categories
    };
  }

  /**
   * Get filter options
   */
  async getFilterOptions(): Promise<ApiResponse<any>> {
    const [materials, colors, styles, brands] = await Promise.all([
      Product.distinct('materials', { status: 'active' }),
      Product.distinct('colors', { status: 'active' }),
      Product.distinct('styles', { status: 'active' }),
      Product.distinct('brand', { status: 'active' })
    ]);

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

    return {
      success: true,
      data: {
        materials: materials.flat().filter(Boolean),
        colors: colors.flat().filter(Boolean),
        styles: styles.flat().filter(Boolean),
        brands: brands.filter(Boolean),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
      }
    };
  }

  /**
   * Reserve inventory for order
   */
  async reserveInventory(productId: string, quantity: number): Promise<void> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await product.reserveInventory(quantity);
  }

  /**
   * Release reserved inventory
   */
  async releaseReservedInventory(productId: string, quantity: number): Promise<void> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await product.releaseReservedInventory(quantity);
  }

  /**
   * Fulfill order (reduce actual inventory)
   */
  async fulfillOrder(productId: string, quantity: number): Promise<void> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await product.fulfillOrder(quantity);
  }
}
