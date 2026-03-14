const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updatePaymentStatus,
    adminGetAllOrders,
    adminUpdateOrderStatus,
    adminGetOrderStats,
    adminDeleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

// --- Public Admin Routes (No Auth Required) ---
router.get('/admin/all', adminGetAllOrders);
router.get('/admin/stats', adminGetOrderStats);
router.put('/admin/:id/status', adminUpdateOrderStatus);
router.delete('/admin/:id', adminDeleteOrder);

// --- Protected Customer Routes ---
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updatePaymentStatus);

module.exports = router;