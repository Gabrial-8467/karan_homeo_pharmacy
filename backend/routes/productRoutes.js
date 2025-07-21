const express = require('express');
const router = express.Router();
const {
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminGetAllProducts,
    adminUpdateStock,
    getProducts,
    getProduct,
    createProductReview
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Remove authentication middleware from admin/product routes
// Change from:
// router.post('/', protect, restrictTo('admin'), adminCreateProduct);
// To:
router.post('/', adminCreateProduct);
router.get('/admin/all', adminGetAllProducts);
router.put('/:id', adminUpdateProduct);
router.delete('/:id', adminDeleteProduct);
router.patch('/:id/stock', adminUpdateStock);

// Protected routes (logged-in users)
router.post('/:id/reviews', createProductReview);

module.exports = router; 