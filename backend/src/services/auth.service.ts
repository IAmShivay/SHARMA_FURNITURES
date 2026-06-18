import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { IUser, ApiResponse } from '../types';
import { RegisterInput, LoginInput, ChangePasswordInput, UpdateProfileInput } from '../validations/auth.validation';
import { AppError } from '../utils/AppError';

export class AuthService {
  /**
   * Generate JWT token
   */
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.sign({ id: userId }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });
  }

  /**
   * Register new user
   */
  async register(userData: RegisterInput): Promise<ApiResponse<{ user: IUser; token: string }>> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = this.generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    };
  }

  /**
   * Login user
   */
  async login(credentials: LoginInput): Promise<ApiResponse<{ user: IUser; token: string }>> {
    const { email, password } = credentials;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support.', 401);
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    // Remove password from response
    user.password = undefined as any;

    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<ApiResponse<{ user: IUser }>> {
    const user = await User.findById(userId)
      .populate('wishlist', 'name images basePrice')
      .populate('cart.product', 'name images basePrice');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      success: true,
      data: { user },
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateData: UpdateProfileInput): Promise<ApiResponse<{ user: IUser }>> {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    };
  }

  /**
   * Change password
   */
  async changePassword(userId: string, passwordData: ChangePasswordInput): Promise<ApiResponse<null>> {
    const { currentPassword, newPassword } = passwordData;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('No user found with this email address', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set expiry
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production)
    console.log('Reset token:', resetToken);

    return {
      success: true,
      message: 'Password reset email sent',
    };
  }

  /**
   * Reset password
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<ApiResponse<null>> {
    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return {
      success: true,
      message: 'Password reset successful',
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(userId: string): Promise<ApiResponse<{ token: string }>> {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    const token = this.generateToken(user._id);

    return {
      success: true,
      data: {
        token,
      },
    };
  }
}
