const webpush = require('web-push');

// Use fixed VAPID keys (generate these once and keep them consistent)
// You can generate these using: npx web-push generate-vapid-keys
const vapidKeys = {
    publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa1FQj8vC8w0gPCPZw4LbFFFuSJIFzGvUY8O-xsZTzQ_2VNW6jpI26m7I3gVQ',
    privateKey: 'Vk6sszSAdj9bBLkZ54BM6i9vj_CeUcdQswALDdLHDqo'
};

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