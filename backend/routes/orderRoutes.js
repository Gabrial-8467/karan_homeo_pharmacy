const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
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

// --- Public Admin Routes (No Auth Required) ---
router.get('/admin/all', adminGetAllOrders);
router.get('/admin/stats', adminGetOrderStats);
router.put('/admin/:id/status', adminUpdateOrderStatus);
router.delete('/admin/:id', adminDeleteOrder);

// --- Protected Customer Routes ---
// All routes defined below this line will require a valid user token
router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updatePaymentStatus);

module.exports = router; 