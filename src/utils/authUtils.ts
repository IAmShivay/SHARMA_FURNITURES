import { User } from '../store/slices/authSlice';

/**
 * Authentication utilities for consistent handling of auth-related functionality
 */

/**
 * Check if the current user has a specific permission
 * @param user The current user object
 * @param permission The permission to check
 * @returns Boolean indicating if user has permission
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // Permission mapping based on roles
  const permissionMap: Record<string, string[]> = {
    // Product permissions
    'products:read': ['customer', 'support', 'manager', 'admin'],
    'products:create': ['manager', 'admin'],
    'products:update': ['manager', 'admin'],
    'products:delete': ['admin'],
    
    // Order permissions
    'orders:read': ['customer', 'support', 'manager', 'admin'],
    'orders:create': ['customer', 'support', 'manager', 'admin'],
    'orders:update': ['support', 'manager', 'admin'],
    'orders:delete': ['admin'],
    'orders:read_all': ['support', 'manager', 'admin'],
    
    // User permissions
    'users:read': ['customer', 'support', 'manager', 'admin'],
    'users:create': ['manager', 'admin'],
    'users:update': ['customer', 'support', 'manager', 'admin'],
    'users:delete': ['admin'],
    'users:read_all': ['support', 'manager', 'admin'],
    'users:manage_roles': ['admin'],
    
    // Admin permissions
    'admin:dashboard': ['support', 'manager', 'admin'],
    'admin:analytics': ['manager', 'admin'],
    'admin:settings': ['admin'],
    'admin:system': ['admin'],
    
    // Customer service permissions
    'support:tickets': ['support', 'manager', 'admin'],
    'support:respond': ['support', 'manager', 'admin'],
    'support:escalate': ['support', 'manager', 'admin'],
    
    // Inventory permissions
    'inventory:read': ['support', 'manager', 'admin'],
    'inventory:update': ['manager', 'admin'],
    
    // Financial permissions
    'finance:read': ['manager', 'admin'],
    'finance:reports': ['manager', 'admin'],
    'finance:refunds': ['manager', 'admin']
  };
  
  const allowedRoles = permissionMap[permission];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(user.role);
};

/**
 * Check if user has admin role
 * @param user The current user object
 * @returns Boolean indicating if user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

/**
 * Check if user has manager or admin role
 * @param user The current user object
 * @returns Boolean indicating if user is a manager or admin
 */
export const isManagerOrAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.role === 'manager';
};

/**
 * Check if user has support, manager or admin role
 * @param user The current user object
 * @returns Boolean indicating if user is support staff or higher
 */
export const isSupportOrAbove = (user: User | null): boolean => {
  return ['admin', 'manager', 'support'].includes(user?.role || '');
};

/**
 * Check if user owns a resource or has admin privileges
 * @param user The current user object
 * @param resourceUserId The user ID associated with the resource
 * @returns Boolean indicating if user owns the resource or has admin privileges
 */
export const ownerOrAdmin = (user: User | null, resourceUserId: string): boolean => {
  if (!user) return false;
  
  // Admin and managers can access everything
  if (['admin', 'manager'].includes(user.role)) {
    return true;
  }
  
  // Check if user owns the resource
  return user.id === resourceUserId;
};

/**
 * Parse and handle JWT token expiration
 * @param token JWT token
 * @returns Object with expiration status and decoded payload
 */
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    const isExpired = decoded.exp * 1000 < Date.now();
    
    return { isExpired, decoded };
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return { isExpired: true, decoded: null };
  }
};

/**
 * Get remaining token validity time in seconds
 * @param token JWT token
 * @returns Number of seconds until token expires, or 0 if expired/invalid
 */
export const getTokenRemainingTime = (token: string): number => {
  try {
    const { decoded, isExpired } = parseJwt(token);
    if (isExpired || !decoded) return 0;
    
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  } catch (error) {
    return 0;
  }
};
