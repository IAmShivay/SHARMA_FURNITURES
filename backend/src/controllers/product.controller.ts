import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import {
  CreateProductInput,
  UpdateProductInput,
  GetProductsInput,
  SearchProductsInput,
  AddReviewInput
} from '../validations/product.validation';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @desc    Get all products with filters
   * @route   GET /api/products
   * @access  Public
   */
  getProducts = asyncHandler(async (req: Request<{}, {}, {}, GetProductsInput>, res: Response, next: NextFunction) => {
    const result = await this.productService.getProducts(req.query);
    res.status(200).json(result);
  });

  /**
   * @desc    Get single product by ID
   * @route   GET /api/products/:id
   * @access  Public
   */
  getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.productService.getProductById(req.params.id);
    res.status(200).json(result);
  });

  /**
   * @desc    Get product by slug
   * @route   GET /api/products/slug/:slug
   * @access  Public
   */
  getProductBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.productService.getProductBySlug(req.params.slug);
    res.status(200).json(result);
  });

  /**
   * @desc    Get featured products
   * @route   GET /api/products/featured
   * @access  Public
   */
  getFeaturedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    const result = await this.productService.getFeaturedProducts(limit);
    res.status(200).json(result);
  });

  /**
   * @desc    Search products
   * @route   GET /api/products/search
   * @access  Public
   */
  searchProducts = asyncHandler(async (req: Request<{}, {}, {}, SearchProductsInput>, res: Response, next: NextFunction) => {
    const { q, page, limit } = req.query;
    const result = await this.productService.searchProducts(q, page, limit);
    res.status(200).json(result);
  });

  /**
   * @desc    Create new product
   * @route   POST /api/products
   * @access  Private (Manager, Admin)
   */
  createProduct = asyncHandler(async (req: AuthenticatedRequest<{}, {}, CreateProductInput>, res: Response, next: NextFunction) => {
    const result = await this.productService.createProduct(req.body, req.user._id);
    res.status(201).json(result);
  });

  /**
   * @desc    Update product
   * @route   PUT /api/products/:id
   * @access  Private (Manager, Admin)
   */
  updateProduct = asyncHandler(async (req: AuthenticatedRequest<{ id: string }, {}, UpdateProductInput>, res: Response, next: NextFunction) => {
    const result = await this.productService.updateProduct(req.params.id, req.body, req.user._id);
    res.status(200).json(result);
  });

  /**
   * @desc    Delete product
   * @route   DELETE /api/products/:id
   * @access  Private (Admin)
   */
  deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  });

  /**
   * @desc    Add product review
   * @route   POST /api/products/:id/reviews
   * @access  Private
   */
  addReview = asyncHandler(async (req: AuthenticatedRequest<{ id: string }, {}, AddReviewInput>, res: Response, next: NextFunction) => {
    const result = await this.productService.addReview(req.params.id, req.user._id, req.body);
    res.status(201).json(result);
  });

  /**
   * @desc    Get product categories
   * @route   GET /api/products/categories
   * @access  Public
   */
  getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.productService.getCategories();
    res.status(200).json(result);
  });

  /**
   * @desc    Get filter options
   * @route   GET /api/products/filters
   * @access  Public
   */
  getFilterOptions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await this.productService.getFilterOptions();
    res.status(200).json(result);
  });

  /**
   * @desc    Reserve inventory
   * @route   POST /api/products/:id/reserve
   * @access  Private
   */
  reserveInventory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    await this.productService.reserveInventory(req.params.id, quantity);
    res.status(200).json({
      success: true,
      message: 'Inventory reserved successfully'
    });
  });

  /**
   * @desc    Release reserved inventory
   * @route   POST /api/products/:id/release
   * @access  Private
   */
  releaseReservedInventory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    await this.productService.releaseReservedInventory(req.params.id, quantity);
    res.status(200).json({
      success: true,
      message: 'Reserved inventory released successfully'
    });
  });

  /**
   * @desc    Fulfill order
   * @route   POST /api/products/:id/fulfill
   * @access  Private
   */
  fulfillOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    await this.productService.fulfillOrder(req.params.id, quantity);
    res.status(200).json({
      success: true,
      message: 'Order fulfilled successfully'
    });
  });
}
