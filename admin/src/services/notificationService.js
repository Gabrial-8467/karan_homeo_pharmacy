import axios from 'axios';

const api = axios.create({ 
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api` 
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class NotificationService {
    constructor() {
        this.swRegistration = null;
        this.isSubscribed = false;
    }

    // Initialize service worker
    async init() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
                
                // Wait for service worker to be ready
                await navigator.serviceWorker.ready;
                console.log('Service Worker is ready');
                return true;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                return false;
            }
        }
        console.log('Service Worker or PushManager not supported');
        return false;
    }

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            throw new Error('This browser does not support notifications');
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    // Get VAPID public key from server
    async getVapidPublicKey() {
        try {
            const response = await api.get('/notifications/vapid-public-key');
            return response.data.publicKey;
        } catch (error) {
            console.error('Error getting VAPID key:', error);
            throw error;
        }
    }

    // Subscribe to push notifications
    async subscribe() {
        try {
            console.log('Starting subscription process...');
            
            // Get VAPID public key
            const vapidPublicKey = await this.getVapidPublicKey();
            console.log('VAPID public key received');
            
            // Convert VAPID key to Uint8Array
            const vapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
            console.log('VAPID key converted to Uint8Array');
            
            // Subscribe to push notifications
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey
            });
            console.log('Push subscription created:', subscription);

            // Send subscription to server
            const response = await api.post('/notifications/subscribe', {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
                    auth: this.arrayBufferToBase64(subscription.getKey('auth'))
                },
                userAgent: navigator.userAgent
            });
            console.log('Subscription saved to server:', response.data);

            this.isSubscribed = true;
            return true;
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
            if (error.response) {
                console.error('Server error:', error.response.data);
            }
            throw error;
        }
    }

    // Unsubscribe from push notifications
    async unsubscribe() {
        try {
            const subscription = await this.swRegistration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                await api.delete('/notifications/unsubscribe', {
                    data: { endpoint: subscription.endpoint }
                });
            }
            this.isSubscribed = false;
            return true;
        } catch (error) {
            console.error('Error unsubscribing from notifications:', error);
            throw error;
        }
    }

    // Check if user is subscribed
    async checkSubscription() {
        try {
            const subscription = await this.swRegistration.pushManager.getSubscription();
            this.isSubscribed = !!subscription;
            return this.isSubscribed;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    }

    // Convert URL-safe base64 to Uint8Array
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Convert ArrayBuffer to base64
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}

export default new NotificationService(); 