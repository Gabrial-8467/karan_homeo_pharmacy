const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

// Path to store VAPID keys
const keysPath = path.join(__dirname, 'vapid-keys.json');

// Function to generate and save VAPID keys
function generateAndSaveKeys() {
    const keys = webpush.generateVAPIDKeys();
    fs.writeFileSync(keysPath, JSON.stringify(keys, null, 2));
    return keys;
}

// Function to load existing keys or generate new ones
function getVapidKeys() {
    try {
        if (fs.existsSync(keysPath)) {
            const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
            return keys;
        } else {
            return generateAndSaveKeys();
        }
    } catch (error) {
        console.log('Error loading VAPID keys, generating new ones:', error.message);
        return generateAndSaveKeys();
    }
}

const vapidKeys = getVapidKeys();

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