const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/adminController');

// Public admin routes (no auth required)
router.get('/dashboard', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router; 