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

// Save subscription (admin only)
router.post('/subscribe', protect, restrictTo('admin'), saveSubscription);

// Delete subscription (admin only)
router.delete('/unsubscribe', protect, restrictTo('admin'), deleteSubscription);

module.exports = router; 