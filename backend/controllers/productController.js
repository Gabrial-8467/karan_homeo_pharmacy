const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Update all products missing manufacturer on server start
Product.updateMany({ manufacturer: { $exists: false } }, { $set: { manufacturer: 'Unknown Manufacturer' } }).then(res => {
  if (res.modifiedCount > 0) {
    console.log(`Updated ${res.modifiedCount} products with default manufacturer.`);
  }
});

// Admin Controllers
exports.adminCreateProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            // createdBy: req.user._id // No user in open admin panel
        });

        const createdProduct = await product.save();
        res.status(201).json({
            success: true,
            data: createdProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.adminUpdateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update product fields
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });

        const updatedProduct = await product.save();
        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.adminDeleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete image file if it's a local upload
        if (product.image && product.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', product.image);
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Failed to delete product image:', err);
                }
            });
        }

        // Delete image from Cloudinary if it's a Cloudinary URL
        if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
            // Extract public_id from the Cloudinary URL
            const matches = product.image.match(/\/([^\/]+)\.[a-zA-Z]+$/);
            if (matches && matches[1]) {
                const publicId = `karan-homeo-pharmacy/${matches[1]}`;
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error('Failed to delete image from Cloudinary:', err);
                }
            }
        }

        await product.deleteOne();
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.adminGetAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, sort, category, manufacturer } = req.query;
        
        // Build query
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { manufacturer: { $regex: search, $options: 'i' } },
                { categories: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Add category filter
        if (category) {
            query.categories = { $in: [category] };
        }

        // Add manufacturer filter
        if (manufacturer) {
            query.manufacturer = manufacturer;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Build sort object
        let sortObj = { createdAt: -1 }; // default sort
        if (sort) {
            const [field, order] = sort.split('-');
            sortObj = { [field]: order === 'asc' ? 1 : -1 };
        }
        
        // Execute query with pagination and lean() for better performance
        const products = await Product.find(query)
            .select('name price image manufacturer categories usage createdAt')
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Public Controllers
exports.getProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice, minRating, sort, page = 1, limit = 20 } = req.query;
        
        // Build query
        const query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { manufacturer: { $regex: search, $options: 'i' } },
                { categories: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        
        let products = Product.find(query)
            .select('name price image manufacturer categories usage description')
            .skip(skip)
            .limit(parseInt(limit));

        // Apply sorting
        switch (sort) {
            case 'price-asc':
                products = products.sort('price');
                break;
            case 'price-desc':
                products = products.sort('-price');
                break;
            case 'rating-desc':
                products = products.sort('-rating');
                break;
            default:
                products = products.sort('-createdAt');
        }

        const result = await products.lean();
        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            count: result.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 