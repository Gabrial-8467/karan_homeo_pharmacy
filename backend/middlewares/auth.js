const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('🔍 Auth Middleware - Token found:', !!token);
    console.log('🔍 Auth Middleware - Authorization header:', req.headers.authorization);

    if (!token) {
      console.log('🔍 Auth Middleware - No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    console.log('🔍 Auth Middleware - Token decoded:', decoded);

    // 3. Find user and exclude password field
    const user = await User.findById(decoded.id).select('-password');
    console.log('🔍 Auth Middleware - User found:', !!user);
    
    if (!user) {
      console.log('🔍 Auth Middleware - User no longer exists');
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // 4. Attach user to request
    req.user = user;
    console.log('🔍 Auth Middleware - req.user set successfully');
    next();
  } catch (error) {
    console.error('🔥 Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  }
};

// Middleware to restrict access to admin only
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
