const express = require('express');
const router = express.Router();
const { 
    getVapidPublicKey, 
    saveSubscription, 
    deleteSubscription 
} = require('../controllers/notificationController');
const { protect, restrictTo } = require('../middlewares/auth');

// Get VAPID public key (public endpoint)
router.get('/vapid-public-key', getVapidPublicKey);

// Test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Notification routes are working!' });
});

// Debug authentication endpoint
router.get('/debug-auth', protect, (req, res) => {
    res.json({
        success: true,
        message: 'Authentication successful',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Send test notification
router.post('/test', protect, restrictTo('admin'), async (req, res) => {
    try {
        const { title, body, icon } = req.body;
        
        const notificationData = {
            title: title || 'Test Notification',
            body: body || 'This is a test notification',
            icon: icon || '/favicon-96x96.png',
            data: {
                url: '/admin/orders'
            }
        };
        
        const { sendNotification } = require('../controllers/notificationController');
        await sendNotification(notificationData);
        
        res.json({
            success: true,
            message: 'Test notification sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Save subscription (admin only)
router.post('/subscribe', protect, restrictTo('admin'), saveSubscription);

// Delete subscription (admin only)
router.delete('/unsubscribe', protect, restrictTo('admin'), deleteSubscription);

module.exports = router; 