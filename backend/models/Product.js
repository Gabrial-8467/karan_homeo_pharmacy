const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    usage: {
        type: String,
        default: '',
        trim: true
    },
    manufacturer: {
        type: String,
        default: '',
        trim: true
    },
    categories: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the average rating when a review is added or modified
productSchema.methods.updateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
    } else {
        this.rating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
        this.numReviews = this.reviews.length;
    }
};

// Update timestamps on save
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 