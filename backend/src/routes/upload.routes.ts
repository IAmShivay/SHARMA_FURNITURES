import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import cloudinary from '../config/cloudinary';
import { auth, hasPermission } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post(
  '/',
  auth,
  hasPermission('admin:dashboard'),
  upload.array('images', 10),
  asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const folder = (req.query.folder as string) || 'gallery';

    const uploadPromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `luxehome/${folder}`,
              transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            }
          );
          stream.end(file.buffer);
        })
    );

    const urls = await Promise.all(uploadPromises);
    res.json({ success: true, data: { urls } });
  })
);

router.delete(
  '/',
  auth,
  hasPermission('admin:dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL required' });
    }

    const parts = url.split('/');
    const fileWithExt = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${fileWithExt.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
  })
);

export default router;
