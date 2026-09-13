import { Router } from 'express';
import { auth, hasPermission } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/gallery.controller';

const router = Router();


router.get('/', asyncHandler(getGalleryItems));

router.get('/:id', asyncHandler(getGalleryItem));


router.post('/', auth, hasPermission('admin:dashboard'), asyncHandler(createGalleryItem));

router.put('/:id', auth, hasPermission('admin:dashboard'), asyncHandler(updateGalleryItem));

router.delete('/:id', auth, hasPermission('admin:dashboard'), asyncHandler(deleteGalleryItem));

export default router;
