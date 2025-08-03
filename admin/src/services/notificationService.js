import axios from 'axios';

const api = axios.create({ 
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api` 
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
                console.log('Service Worker registered');
                return true;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                return false;
            }
        }
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
            // Get VAPID public key
            const vapidPublicKey = await this.getVapidPublicKey();
            
            // Convert VAPID key to Uint8Array
            const vapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
            
            // Subscribe to push notifications
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey
            });

            // Send subscription to server
            await api.post('/notifications/subscribe', {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
                    auth: this.arrayBufferToBase64(subscription.getKey('auth'))
                },
                userAgent: navigator.userAgent
            });

            this.isSubscribed = true;
            return true;
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
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