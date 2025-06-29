import { Router } from 'express';
import { auth } from '../middleware/auth';

const router = Router();

// Placeholder routes - implement as needed
router.get('/profile', auth, (req, res) => {
  res.json({ success: true, data: req.user });
});

export default router;
