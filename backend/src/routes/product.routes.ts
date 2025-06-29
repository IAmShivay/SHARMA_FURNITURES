import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validateRequest } from '../middleware/validation';
import { auth, hasPermission } from '../middleware/auth';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getProductsSchema,
  searchProductsSchema,
  addReviewSchema,
} from '../validations/product.validation';

const router = Router();
const productController = new ProductController();

// Public routes
router.get(
  '/',
  validateRequest(getProductsSchema),
  productController.getProducts
);

router.get(
  '/featured',
  productController.getFeaturedProducts
);

router.get(
  '/categories',
  productController.getCategories
);

router.get(
  '/filters',
  productController.getFilterOptions
);

router.get(
  '/search',
  validateRequest(searchProductsSchema),
  productController.searchProducts
);

router.get(
  '/slug/:slug',
  productController.getProductBySlug
);

router.get(
  '/:id',
  validateRequest(getProductSchema),
  productController.getProduct
);

// Protected routes
router.post(
  '/',
  auth,
  hasPermission('products:create'),
  validateRequest(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  auth,
  hasPermission('products:update'),
  validateRequest(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  auth,
  hasPermission('products:delete'),
  validateRequest(getProductSchema),
  productController.deleteProduct
);

router.post(
  '/:id/reviews',
  auth,
  validateRequest(addReviewSchema),
  productController.addReview
);

router.post(
  '/:id/reserve',
  auth,
  validateRequest(getProductSchema),
  productController.reserveInventory
);

router.post(
  '/:id/release',
  auth,
  validateRequest(getProductSchema),
  productController.releaseReservedInventory
);

router.post(
  '/:id/fulfill',
  auth,
  validateRequest(getProductSchema),
  productController.fulfillOrder
);

export default router;
