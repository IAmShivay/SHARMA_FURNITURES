import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import cloudinary from '../config/cloudinary';
import { auth, hasPermission } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `LuxeHouse/${folder}`,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result || !result.secure_url) return reject(new Error('No URL returned from Cloudinary'));
        resolve(result.secure_url);
      }
    );

    // Handle stream errors (e.g., missing credentials, network issues)
    stream.on('error', (err: Error) => {
      reject(err);
    });

    stream.end(buffer);
  });
}

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

    // Check Cloudinary configuration
    const cloudConfig = cloudinary.config();
    if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
      console.error('Cloudinary not configured:', {
        cloud_name: !!cloudConfig.cloud_name,
        api_key: !!cloudConfig.api_key,
        api_secret: !!cloudConfig.api_secret,
      });
      return res.status(500).json({ success: false, message: 'Image upload service not configured' });
    }

    const folder = (req.query.folder as string) || 'gallery';

    try {
      const urls = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, folder))
      );
      res.json({ success: true, data: { urls } });
    } catch (error: any) {
      console.error('Cloudinary upload error:', error.message);
      res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
    }
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
