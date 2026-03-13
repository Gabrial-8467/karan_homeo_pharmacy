const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ✅ Generate JWT token safely with fallback
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || "fallback_secret_key", // fallback secret
        {
            expiresIn: process.env.JWT_EXPIRE || "2d" // fallback expiry
        }
    );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { fullName, name, email, password, userType, studentType } = req.body;

        // Handle both fullName (from Flutter) and name fields
        const userName = fullName || name;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }

        // 2. Create user with all fields
        user = await User.create({
            name: userName,
            email,
            password,
            userType: userType || 'customer',
            studentType: studentType || 'hostler',
            role: 'user'
        });

        // 3. Generate token
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userType: user.userType,
                studentType: user.studentType,
                token
            }
        });
    } catch (error) {
        console.error("🔥 Register error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Server error in register"
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🛑 Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // 3. Generate token
        const token = generateToken(user._id);

        return res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userType: user.userType,
                studentType: user.studentType,
                token
            }
        });

    } catch (error) {
        console.error("🔥 Login error:", error);
        return res.status(500).json({
            success: false,
            error: "Server error during login. Check backend logs."
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("🔥 GetProfile error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Server error in getProfile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, password, userType, studentType } = req.body;

        // Get user from DB
        let user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (userType) user.userType = userType;
        if (studentType) user.studentType = studentType;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        return res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userType: user.userType,
                studentType: user.studentType,
                token: generateToken(user._id) // issue fresh token
            }
        });
    } catch (error) {
        console.error("🔥 UpdateProfile error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Server error in updateProfile'
        });
    }
};
