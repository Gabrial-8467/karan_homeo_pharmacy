// Service Worker for Push Notifications

self.addEventListener('push', function(event) {
    console.log('Push event received:', event);
    
    if (event.data) {
        try {
            const data = event.data.json();
            console.log('Push data:', data);
            
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
                ],
                tag: 'new-order', // Prevents duplicate notifications
                renotify: true
            };

            console.log('Showing notification with options:', options);
            event.waitUntil(
                self.registration.showNotification(data.title, options)
            );
        } catch (error) {
            console.error('Error processing push event:', error);
        }
    } else {
        console.log('No data in push event');
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