import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { 
  RegisterInput, 
  LoginInput, 
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput 
} from '../validations/auth.validation';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @desc    Register new user
   * @route   POST /api/auth/register
   * @access  Public
   */
  register = asyncHandler(async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => {
    const result = await this.authService.register(req.body);
    res.status(201).json(result);
  });

  /**
   * @desc    Login user
   * @route   POST /api/auth/login
   * @access  Public
   */
  login = asyncHandler(async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
    const result = await this.authService.login(req.body);
    res.status(200).json(result);
  });

  /**
   * @desc    Get user profile
   * @route   GET /api/auth/profile
   * @access  Private
   */
  getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const result = await this.authService.getProfile(req.user._id);
    res.status(200).json(result);
  });

  /**
   * @desc    Update user profile
   * @route   PUT /api/auth/profile
   * @access  Private
   */
  updateProfile = asyncHandler(async (req: AuthenticatedRequest<{}, {}, UpdateProfileInput>, res: Response, next: NextFunction) => {
    const result = await this.authService.updateProfile(req.user._id, req.body);
    res.status(200).json(result);
  });

  /**
   * @desc    Change password
   * @route   PUT /api/auth/change-password
   * @access  Private
   */
  changePassword = asyncHandler(async (req: AuthenticatedRequest<{}, {}, ChangePasswordInput>, res: Response, next: NextFunction) => {
    const result = await this.authService.changePassword(req.user._id, req.body);
    res.status(200).json(result);
  });

  /**
   * @desc    Forgot password
   * @route   POST /api/auth/forgot-password
   * @access  Public
   */
  forgotPassword = asyncHandler(async (req: Request<{}, {}, ForgotPasswordInput>, res: Response, next: NextFunction) => {
    const result = await this.authService.forgotPassword(req.body.email);
    res.status(200).json(result);
  });

  /**
   * @desc    Reset password
   * @route   POST /api/auth/reset-password/:token
   * @access  Public
   */
  resetPassword = asyncHandler(async (req: Request<{ token: string }, {}, ResetPasswordInput>, res: Response, next: NextFunction) => {
    const result = await this.authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json(result);
  });

  /**
   * @desc    Refresh token
   * @route   POST /api/auth/refresh
   * @access  Private
   */
  refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const result = await this.authService.refreshToken(req.user._id);
    res.status(200).json(result);
  });

  /**
   * @desc    Logout user
   * @route   POST /api/auth/logout
   * @access  Private
   */
  logout = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // In a real app, you might want to blacklist the token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });
}
