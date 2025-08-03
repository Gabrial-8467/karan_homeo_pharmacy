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

// Send test notification (no auth required)
router.post('/test', async (req, res) => {
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

// Save subscription (no auth required)
router.post('/subscribe', saveSubscription);

// Delete subscription (no auth required)
router.delete('/unsubscribe', deleteSubscription);

module.exports = router; 