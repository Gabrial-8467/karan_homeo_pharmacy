const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/adminController');

// Protect all admin routes
router.use(protect, restrictTo('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router; 