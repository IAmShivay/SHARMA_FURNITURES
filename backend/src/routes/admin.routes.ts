import { Router, Response } from 'express';
import { auth, hasPermission } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

const router = Router();

// GET /api/admin/dashboard - Dashboard statistics
router.get(
  '/dashboard',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalUsers,
      totalProducts,
      lowStockProducts,
      revenueResult,
      recentOrders,
      topProducts,
      newUsersCount,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'processing'] } }),
      Order.countDocuments({ status: { $in: ['delivered', 'completed'] } }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({
        status: 'active',
        $expr: {
          $lte: [
            { $subtract: ['$inventory.quantity', '$inventory.reserved'] },
            '$inventory.lowStockThreshold',
          ],
        },
      }),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email'),
      Product.find({ status: 'active' })
        .sort({ salesCount: -1 })
        .limit(5)
        .select('name images basePrice salesCount category'),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Revenue by day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $nin: ['cancelled', 'refunded'] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
          totalUsers,
          newUsers: newUsersCount,
          totalProducts,
          lowStockProducts,
        },
        topProducts,
        recentOrders,
        revenueByDay,
      },
    });
  })
);

// GET /api/admin/users - List all users
router.get(
  '/users',
  auth,
  hasPermission('admin:users'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  })
);

// PUT /api/admin/users/:id/role - Update user role
router.put(
  '/users/:id/role',
  auth,
  hasPermission('admin:users'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  })
);

// PUT /api/admin/users/:id/status - Activate/deactivate user
router.put(
  '/users/:id/status',
  auth,
  hasPermission('admin:users'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  })
);

// GET /api/admin/orders - List all orders
router.get(
  '/orders',
  auth,
  hasPermission('admin:orders'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter: any = {};
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email');

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      },
    });
  })
);

// PUT /api/admin/orders/:id/status - Update order status
router.put(
  '/orders/:id/status',
  auth,
  hasPermission('admin:orders'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    (order.timeline as any).push({
      status,
      timestamp: new Date(),
      description: notes || `Status updated to ${status}`,
      updatedBy: req.user._id.toString(),
    });

    await order.save();

    res.json({
      success: true,
      data: {
        order: {
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          status: order.status,
          timeline: order.timeline,
        },
      },
    });
  })
);

export default router;
