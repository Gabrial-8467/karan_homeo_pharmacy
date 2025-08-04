const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Profile routes (no auth required)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router; 