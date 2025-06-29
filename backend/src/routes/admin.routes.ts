import { Router } from 'express';
import { auth, hasPermission } from '../middleware/auth';

const router = Router();

// Placeholder routes - implement as needed
router.get('/dashboard', auth, hasPermission('admin:dashboard'), (req, res) => {
  res.json({ success: true, data: { message: 'Admin dashboard' } });
});

export default router;
