const express = require('express');
const router = express.Router();
const { 
    getVapidPublicKey, 
    saveSubscription, 
    deleteSubscription 
} = require('../controllers/notificationController');
const { protect, admin } = require('../middlewares/auth');

// Get VAPID public key
router.get('/vapid-public-key', getVapidPublicKey);

// Save subscription (admin only)
router.post('/subscribe', protect, admin, saveSubscription);

// Delete subscription (admin only)
router.delete('/unsubscribe', protect, admin, deleteSubscription);

module.exports = router; 