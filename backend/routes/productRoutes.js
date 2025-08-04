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

// Admin routes (must come before /:id to avoid conflicts)
router.get('/admin/all', adminGetAllProducts);
router.post('/', adminCreateProduct);
router.put('/:id', adminUpdateProduct);
router.delete('/:id', adminDeleteProduct);

// Product detail route (must come after admin routes)
router.get('/:id', getProduct);

// Protected routes (logged-in users)

module.exports = router; 