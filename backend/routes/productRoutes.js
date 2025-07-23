const express = require('express');
const router = express.Router();
const {
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminGetAllProducts,
    getProducts,
    getProduct
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

// Protected routes (logged-in users)

module.exports = router; 