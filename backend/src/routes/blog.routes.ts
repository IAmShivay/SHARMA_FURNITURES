import { Router, Request, Response } from 'express';
import { auth, hasPermission } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import BlogPost from '../models/BlogPost';

const router = Router();

// ─── Public Routes ───

// GET /api/blog - List published blog posts
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const tag = req.query.tag as string;
    const search = req.query.search as string;

    const filter: any = { status: 'published' };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-content');

    res.json({
      success: true,
      data: {
        items: posts,
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

// GET /api/blog/categories - Get blog categories with counts
router.get(
  '/categories',
  asyncHandler(async (_req: Request, res: Response) => {
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories.map((c) => ({ name: c._id, count: c.count })),
    });
  })
);

// GET /api/blog/slug/:slug - Get single published post by slug
router.get(
  '/slug/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'name avatar');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.json({ success: true, data: { post } });
  })
);

// ─── Admin Routes ───

// GET /api/blog/admin - List all posts (admin)
router.get(
  '/admin',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const filter: any = {};
    if (status) filter.status = status;

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar')
      .select('-content');

    res.json({
      success: true,
      data: {
        items: posts,
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

// POST /api/blog - Create blog post
router.post(
  '/',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const post = await BlogPost.create({
      ...req.body,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: { post } });
  })
);

// PUT /api/blog/:id - Update blog post
router.put(
  '/:id',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.json({ success: true, data: { post } });
  })
);

// DELETE /api/blog/:id - Delete blog post
router.delete(
  '/:id',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.json({ success: true, message: 'Blog post deleted' });
  })
);

export default router;
