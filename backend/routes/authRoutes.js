const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const router = express.Router();

// Define routes
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;   // 👈 this line is critical
