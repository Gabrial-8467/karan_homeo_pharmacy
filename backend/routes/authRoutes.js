const express = require('express');
const { login, register, getProfile, updateProfile } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
