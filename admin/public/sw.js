// Service Worker for Push Notifications

self.addEventListener('push', function(event) {
    console.log('Push event received:', event);
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: data.icon || '/favicon-96x96.png',
            badge: data.badge || '/favicon-96x96.png',
            data: data.data || {},
            requireInteraction: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Order',
                    icon: '/favicon-96x96.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/favicon-96x96.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        // Open the admin panel to the orders page
        event.waitUntil(
            clients.openWindow('/admin/orders')
        );
    }
});

self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed:', event);
});

// Handle installation
self.addEventListener('install', function(event) {
    console.log('Service Worker installed');
    self.skipWaiting();
});

// Handle activation
self.addEventListener('activate', function(event) {
    console.log('Service Worker activated');
    event.waitUntil(self.clients.claim());
}); 