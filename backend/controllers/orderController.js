const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Admin Controllers
exports.adminGetAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('orderItems.product', 'name')
            .sort('-createdAt');

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminUpdateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = req.body.status;

        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminGetOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

        const totalRevenue = await Order.aggregate([
            { $match: { orderStatus: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalOrders,
                processingOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminDeleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        await order.deleteOne();
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Customer Controllers
exports.createOrder = async (req, res) => {
    try {
        console.log('Create order request received');
        console.log('User:', req.user);
        console.log('Body:', req.body);

        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated - req.user is undefined' 
            });
        }

        const { orderItems, shippingAddress, paymentMethod } = req.body;

        // Validate required fields
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Order items are required' });
        }
        if (!shippingAddress) {
            return res.status(400).json({ success: false, message: 'Shipping address is required' });
        }
        if (!paymentMethod) {
            return res.status(400).json({ success: false, message: 'Payment method is required' });
        }

        // Validate shipping address fields
        const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'phone'];
        const missingFields = requiredFields.filter(field => !shippingAddress[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Missing required shipping address fields: ${missingFields.join(', ')}` 
            });
        }

        // Validate order items
        for (const item of orderItems) {
            if (!item.product || !item.name || !item.image || !item.price || !item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Each order item must have product, name, image, price, and quantity' 
                });
            }
        }

        console.log('Validation passed, creating order...');

        // Calculate prices manually since pre-save hook has issues
        const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingPrice = 50;
        const totalPrice = itemsPrice + shippingPrice;

        // Create order with calculated prices
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            createdAt: new Date()
        });

        // Use insertOne to bypass pre-save hooks
        const orderData = order.toObject();
        delete orderData._id;
        
        const createdOrder = await Order.insertMany([orderData]);
        const savedOrder = createdOrder[0];

        console.log('Order created successfully:', savedOrder._id);

        if (req.io) {
            req.io.to('admin').emit('new-order', {
                orderId: savedOrder._id,
                customerName: req.user.name,
                totalPrice: savedOrder.totalPrice,
                orderStatus: savedOrder.orderStatus,
                createdAt: savedOrder.createdAt
            });
        }

        res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        // ✅ Fetch orders for logged-in user only
        const orders = await Order.find({ user: req.user._id })
            .populate('orderItems.product', 'name image price')
            .sort('-createdAt');

        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name image price');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // ✅ Only allow owner or admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();

        res.json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
