import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation';
import { auth } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login
);

router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.get(
  '/profile',
  auth,
  authController.getProfile
);

router.put(
  '/profile',
  auth,
  validateRequest(updateProfileSchema),
  authController.updateProfile
);

router.put(
  '/change-password',
  auth,
  validateRequest(changePasswordSchema),
  authController.changePassword
);

router.post(
  '/refresh',
  auth,
  authController.refreshToken
);

router.post(
  '/logout',
  auth,
  authController.logout
);

export default router;
