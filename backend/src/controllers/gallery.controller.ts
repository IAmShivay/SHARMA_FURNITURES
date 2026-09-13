import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import GalleryItem from '../models/Gallery';


export const getGalleryItems = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const type = req.query.type as string;
  const category = req.query.category as string;
  const tag = req.query.tag as string;
  const featured = req.query.featured as string;

  const filter: any = { published: true };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (featured === 'true') filter.featured = true;

  const total = await GalleryItem.countDocuments(filter);
  const items = await GalleryItem.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    },
  });
};

export const getGalleryItem = async (req: Request, res: Response) => {
  const item = await GalleryItem.findOne({
    _id: req.params.id,
    published: true,
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  res.json({ success: true, data: { item } });
};


export const createGalleryItem = async (req: AuthenticatedRequest, res: Response) => {
  const item = await GalleryItem.create(req.body);
  res.status(201).json({ success: true, data: { item } });
};

export const updateGalleryItem = async (req: AuthenticatedRequest, res: Response) => {
  const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  res.json({ success: true, data: { item } });
};

export const deleteGalleryItem = async (req: AuthenticatedRequest, res: Response) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  res.json({ success: true, message: 'Gallery item deleted' });
};
