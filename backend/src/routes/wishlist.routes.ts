import { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/User';
import Product from '../models/Product';

const router = Router();

// GET /api/wishlist - Get user's wishlist
router.get(
  '/',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'name slug images basePrice originalPrice category rating status inventory'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Transform to WishlistItem format expected by frontend
    const wishlistItems = (user.wishlist as any[]).map((product: any) => ({
      id: product._id.toString(),
      productId: product._id.toString(),
      userId: user._id.toString(),
      product: product.toJSON(),
      addedAt: new Date().toISOString(),
    }));

    res.json({ success: true, data: wishlistItems });
  })
);

// POST /api/wishlist - Add item to wishlist
router.post(
  '/',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already in wishlist
    const wishlistStrings = user.wishlist.map((id: any) => id.toString());
    if (wishlistStrings.includes(productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    const item = {
      id: product._id.toString(),
      productId: product._id.toString(),
      userId: user._id.toString(),
      product: product.toJSON(),
      addedAt: new Date().toISOString(),
    };

    res.status(201).json({ success: true, data: item });
  })
);

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete(
  '/:productId',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      (id: any) => id.toString() !== req.params.productId
    );
    await user.save();

    res.json({ success: true, message: 'Removed from wishlist' });
  })
);

// DELETE /api/wishlist - Clear entire wishlist
router.delete(
  '/',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = [];
    await user.save();

    res.json({ success: true, message: 'Wishlist cleared' });
  })
);

// GET /api/wishlist/check/:productId - Check if item is in wishlist
router.get(
  '/check/:productId',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const inWishlist = user.wishlist.some(
      (id: any) => id.toString() === req.params.productId
    );

    res.json({ success: true, data: { inWishlist } });
  })
);

export default router;
