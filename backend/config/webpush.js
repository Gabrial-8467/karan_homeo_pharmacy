const webpush = require('web-push');

// Generate VAPID keys (you should generate these once and store them securely)
const vapidKeys = webpush.generateVAPIDKeys();

// Configure web-push
webpush.setVapidDetails(
    'mailto:info@karanhomeopharmacy.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

module.exports = {
    webpush,
    vapidKeys
}; 