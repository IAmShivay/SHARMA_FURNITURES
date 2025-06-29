const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Get user from token
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid. User not found.'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

// Permission-based access control
const permissions = {
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

// Check if user has specific permission
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    const allowedRoles = permissions[permission];
    
    if (!allowedRoles) {
      return res.status(500).json({
        success: false,
        message: 'Invalid permission specified.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You don't have permission: ${permission}`
      });
    }

    next();
  };
};

// Check if user owns resource or has admin privileges
const ownerOrAdmin = (resourceField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }

    // Admin can access everything
    if (['admin', 'manager'].includes(req.user.role)) {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params.userId || req.body[resourceField] || req.query[resourceField];
    
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    // If resource is in req.resource (set by previous middleware)
    if (req.resource && req.resource[resourceField]) {
      if (req.resource[resourceField].toString() === req.user._id.toString()) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

// Rate limiting for specific roles
const roleBasedRateLimit = (limits) => {
  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userRole = req.user.role;
    const limit = limits[userRole] || limits.default;

    if (limit) {
      // Implement role-based rate limiting logic here
      // This is a simplified version - in production, you'd use Redis or similar
      req.rateLimit = limit;
    }

    next();
  };
};

// Audit logging middleware
const auditLog = (action) => {
  return (req, res, next) => {
    // Log the action for audit purposes
    const logData = {
      user: req.user ? req.user._id : 'anonymous',
      action,
      resource: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date()
    };

    // In production, you'd save this to a dedicated audit log collection
    console.log('Audit Log:', logData);

    next();
  };
};

// Check if user can perform action on specific resource
const canAccess = (resourceType, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Please authenticate first.'
        });
      }

      const permission = `${resourceType}:${action}`;
      const allowedRoles = permissions[permission];

      if (!allowedRoles) {
        return res.status(500).json({
          success: false,
          message: 'Invalid permission configuration.'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${permission}`
        });
      }

      next();
    } catch (error) {
      console.error('Access control error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error in access control'
      });
    }
  };
};

// Middleware to check if user is admin
const isAdmin = authorize('admin');

// Middleware to check if user is manager or admin
const isManagerOrAdmin = authorize('manager', 'admin');

// Middleware to check if user is support, manager, or admin
const isSupportOrAbove = authorize('support', 'manager', 'admin');

module.exports = {
  auth,
  authorize,
  hasPermission,
  ownerOrAdmin,
  roleBasedRateLimit,
  auditLog,
  canAccess,
  isAdmin,
  isManagerOrAdmin,
  isSupportOrAbove,
  permissions
};
