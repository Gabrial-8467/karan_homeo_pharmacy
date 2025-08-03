const Subscription = require('../models/Subscription');
const { webpush, vapidKeys } = require('../config/webpush');

// Get VAPID public key
exports.getVapidPublicKey = async (req, res) => {
    try {
        res.json({
            success: true,
            publicKey: vapidKeys.publicKey
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Save subscription
exports.saveSubscription = async (req, res) => {
    try {
        const { endpoint, keys, userAgent } = req.body;

        // Check if subscription already exists
        const existingSubscription = await Subscription.findOne({ endpoint });
        
        if (existingSubscription) {
            // Update existing subscription
            existingSubscription.keys = keys;
            existingSubscription.userAgent = userAgent;
            await existingSubscription.save();
        } else {
            // Create new subscription
            const subscription = new Subscription({
                endpoint,
                keys,
                userAgent
            });
            await subscription.save();
        }

        res.json({
            success: true,
            message: 'Subscription saved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send notification to all subscribers
exports.sendNotification = async (notificationData) => {
    try {
        const subscriptions = await Subscription.find();
        
        const notifications = subscriptions.map(subscription => {
            return webpush.sendNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: subscription.keys
                },
                JSON.stringify(notificationData)
            ).catch(error => {
                console.log('Error sending notification:', error);
                // Remove invalid subscriptions
                if (error.statusCode === 410) {
                    return Subscription.findByIdAndDelete(subscription._id);
                }
            });
        });

        await Promise.all(notifications);
        console.log('Notifications sent to', subscriptions.length, 'subscribers');
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};

// Delete subscription
exports.deleteSubscription = async (req, res) => {
    try {
        const { endpoint } = req.body;
        
        await Subscription.findOneAndDelete({ endpoint });
        
        res.json({
            success: true,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 