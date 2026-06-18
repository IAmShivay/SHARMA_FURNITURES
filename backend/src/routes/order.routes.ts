import { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import Order from '../models/Order';
import Product from '../models/Product';

const router = Router();

// GET /api/orders - Get current user's orders
router.get(
  '/',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images basePrice slug');

    res.json({
      success: true,
      data: orders,
    });
  })
);

// GET /api/orders/:id - Get single order
router.get(
  '/:id',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product', 'name images basePrice slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  })
);

// POST /api/orders - Create a new order
router.post(
  '/',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { items, shippingAddress, paymentMethod, deliveryOption } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
      }

      const price = item.price || product.basePrice;
      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        quantity: item.quantity,
        price,
        customization: item.customization,
      });
    }

    const tax = subtotal * 0.08;
    const shippingCost =
      deliveryOption === 'express' ? 49.99 : subtotal > 1000 ? 0 : 99.99;
    const total = subtotal + tax + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      shipping: {
        method: deliveryOption === 'express' ? 'express' : 'standard',
        cost: shippingCost,
        status: 'pending',
      },
      total,
      status: 'confirmed',
      payment: {
        method: paymentMethod === 'card' ? 'credit_card' : paymentMethod,
        status: 'completed',
        amount: total,
        paidAt: new Date(),
      },
      shippingAddress,
      timeline: [
        {
          status: 'confirmed',
          timestamp: new Date(),
          description: 'Order placed and payment confirmed',
        },
      ],
      estimatedDelivery: new Date(
        Date.now() + (deliveryOption === 'express' ? 3 : 7) * 24 * 60 * 60 * 1000
      ),
    });

    res.status(201).json({ success: true, data: order });
  })
);

// PUT /api/orders/:id/status - Update order status (admin/support)
router.put(
  '/:id/status',
  auth,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    (order.timeline as any).push({
      status,
      timestamp: new Date(),
      description: `Order status updated to ${status}`,
      updatedBy: req.user._id.toString(),
    });

    await order.save();

    res.json({ success: true, data: order });
  })
);

export default router;
