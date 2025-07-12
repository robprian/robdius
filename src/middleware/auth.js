import jwt from 'jsonwebtoken';
import { User, Customer } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.userType === 'admin') {
      user = await User.findByPk(decoded.userId);
    } else {
      user = await Customer.findByPk(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Add userType to user object for templates
    req.user = {
      ...user.dataValues,
      userType: decoded.userType
    };
    req.userType = decoded.userType;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

export const superAdminOnly = (req, res, next) => {
  if (req.userType !== 'admin' || req.user.user_type !== 'SuperAdmin') {
    return res.status(403).json({ message: 'Access denied. SuperAdmin only.' });
  }
  next();
};

export const checkPermission = (allowedTypes) => {
  return (req, res, next) => {
    if (req.userType === 'admin' && allowedTypes.includes(req.user.user_type)) {
      return next();
    }
    
    if (req.userType === 'customer' && allowedTypes.includes('Customer')) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  };
};

// Alias for authenticateToken
export const authenticateToken = authMiddleware;

// API Key authentication
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }
  
  next();
};
