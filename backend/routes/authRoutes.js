const express = require('express');
const { login, register, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
