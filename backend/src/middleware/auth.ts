import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticatedRequest, IUser } from '../types';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Authentication middleware
export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw new AppError('Access denied. No token provided.', 401);
  }

  try {
    // Verify token
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as { id: string };
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new AppError('Token is invalid. User not found.', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support.', 401);
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Token is invalid.', 401);
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token has expired.', 401);
    }
    throw error;
  }
});

// Role-based permissions
const PERMISSIONS = {
  // Product permissions
  'products:create': ['manager', 'admin'],
  'products:update': ['manager', 'admin'],
  'products:delete': ['admin'],
  'products:view_all': ['support', 'manager', 'admin'],
  
  // Order permissions
  'orders:create': ['customer', 'support', 'manager', 'admin'],
  'orders:view_own': ['customer', 'support', 'manager', 'admin'],
  'orders:view_all': ['support', 'manager', 'admin'],
  'orders:update': ['support', 'manager', 'admin'],
  'orders:cancel': ['customer', 'support', 'manager', 'admin'],
  'orders:refund': ['manager', 'admin'],
  
  // User permissions
  'users:view_own': ['customer', 'support', 'manager', 'admin'],
  'users:view_all': ['support', 'manager', 'admin'],
  'users:update_own': ['customer', 'support', 'manager', 'admin'],
  'users:update_any': ['manager', 'admin'],
  'users:delete': ['admin'],
  
  // Admin permissions
  'admin:dashboard': ['support', 'manager', 'admin'],
  'admin:analytics': ['manager', 'admin'],
  'admin:settings': ['admin'],
  'admin:users': ['manager', 'admin'],
  'admin:products': ['manager', 'admin'],
  'admin:orders': ['support', 'manager', 'admin'],
  
  // Review permissions
  'reviews:create': ['customer'],
  'reviews:moderate': ['support', 'manager', 'admin'],
  'reviews:delete': ['manager', 'admin'],
};

// Permission checking middleware
export const hasPermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const allowedRoles = PERMISSIONS[permission as keyof typeof PERMISSIONS];
    
    if (!allowedRoles) {
      throw new AppError('Invalid permission.', 400);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions.', 403);
    }

    next();
  };
};

// Check if user owns resource or has admin privileges
export const ownerOrAdmin = (resourceUserField: string = 'user') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    // Admin can access any resource
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      return next();
    }

    // For other users, check ownership in the next middleware
    // This middleware just sets up the check
    req.ownershipCheck = {
      field: resourceUserField,
      userId: req.user._id
    };
    
    next();
  };
};

// Middleware to check resource ownership
export const checkOwnership = (model: any, resourceUserField: string = 'user') => {
  return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    // Admin and manager can access any resource
    if (req.user.role === 'admin' || req.user.role === 'manager') {
      return next();
    }

    const resourceId = req.params.id;
    const resource = await model.findById(resourceId);

    if (!resource) {
      throw new AppError('Resource not found.', 404);
    }

    // Check if user owns the resource
    const resourceUserId = resource[resourceUserField]?.toString();
    const currentUserId = req.user._id.toString();

    if (resourceUserId !== currentUserId) {
      throw new AppError('Access denied. You can only access your own resources.', 403);
    }

    next();
  });
};

// Optional authentication (for routes that work with or without auth)
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without authentication
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as { id: string };
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Ignore token errors for optional auth
    console.log('Optional auth token error:', error);
  }

  next();
});

// Rate limiting for sensitive operations
export const sensitiveOperationLimit = (req: Request, res: Response, next: NextFunction) => {
  // This would typically integrate with Redis for distributed rate limiting
  // For now, we'll use the express-rate-limit middleware configured in server.ts
  next();
};

// Middleware to log user actions
export const logUserAction = (action: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      console.log(`User ${req.user._id} (${req.user.role}) performed action: ${action}`);
      // In production, you'd want to log this to a proper logging service
    }
    next();
  };
};

// Export types for TypeScript
export type Permission = keyof typeof PERMISSIONS;
