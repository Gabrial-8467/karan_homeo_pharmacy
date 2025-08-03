const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        console.log('Auth middleware - Headers:', req.headers);
        
        // 1. Check if token exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Auth middleware - Token found:', token ? 'Yes' : 'No');
        }

        if (!token) {
            console.log('Auth middleware - No token provided');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // 2. Verify token
        console.log('Auth middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Token decoded successfully');

        // 3. Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('Auth middleware - User not found in database');
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        console.log('Auth middleware - User authenticated:', user.email);
        // 4. Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.log('Auth middleware - Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
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