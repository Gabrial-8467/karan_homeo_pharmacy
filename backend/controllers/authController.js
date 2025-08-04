const User = require('../models/User');

// Generate simple token (no JWT for now)
const generateToken = (id) => {
    return `token_${id}_${Date.now()}`;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Simple registration without database
        const token = generateToken('new_user');

        res.status(201).json({
            success: true,
            data: {
                _id: 'new_user',
                name: name || 'Anonymous',
                email: email || 'anonymous@example.com',
                role: 'user',
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Simple login without database
        const token = generateToken('user');

        res.json({
            success: true,
            data: {
                _id: 'user',
                name: 'Anonymous User',
                email: email || 'anonymous@example.com',
                role: 'user',
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Public
exports.getProfile = async (req, res) => {
    try {
        // Since no authentication, return a default profile
        res.json({
            success: true,
            data: {
                _id: 'anonymous',
                name: 'Anonymous User',
                email: 'anonymous@example.com',
                role: 'user'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Public
exports.updateProfile = async (req, res) => {
    try {
        // Since no authentication, return success without updating
        res.json({
            success: true,
            data: {
                _id: 'anonymous',
                name: req.body.name || 'Anonymous User',
                email: req.body.email || 'anonymous@example.com',
                role: 'user'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 