import { useState, useEffect } from 'react';
import { FiBell, FiBellOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import notificationService from '../services/notificationService';

const NotificationSetup = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        checkSupport();
    }, []);

    const checkSupport = async () => {
        const supported = await notificationService.init();
        setIsSupported(supported);
        
        if (supported) {
            const subscribed = await notificationService.checkSubscription();
            setIsSubscribed(subscribed);
            
            // Check notification permission
            if ('Notification' in window) {
                setPermission(Notification.permission);
            }
        }
    };

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            // Request permission first
            const granted = await notificationService.requestPermission();
            if (!granted) {
                toast.error('Notification permission denied');
                return;
            }

            // Subscribe to notifications
            await notificationService.subscribe();
            setIsSubscribed(true);
            setPermission('granted');
            toast.success('Push notifications enabled! You will now receive notifications for new orders.');
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
            toast.error('Failed to enable notifications. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setIsLoading(true);
        try {
            await notificationService.unsubscribe();
            setIsSubscribed(false);
            toast.success('Push notifications disabled');
        } catch (error) {
            console.error('Error unsubscribing from notifications:', error);
            toast.error('Failed to disable notifications');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-yellow-600" />
                    <span className="text-yellow-800 text-sm">
                        Push notifications are not supported in this browser. Make sure you're using HTTPS and a modern browser.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isSubscribed ? (
                        <FiCheckCircle className="text-green-600 text-xl" />
                    ) : (
                        <FiBell className="text-gray-400 text-xl" />
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            Push Notifications
                        </h3>
                        <p className="text-sm text-gray-600">
                            {isSubscribed 
                                ? 'You will receive notifications for new orders'
                                : 'Enable notifications to get alerts for new orders'
                            }
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {permission === 'denied' && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            Permission denied
                        </span>
                    )}
                    
                    {isSubscribed ? (
                        <button
                            onClick={handleUnsubscribe}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                        >
                            <FiBellOff />
                            {isLoading ? 'Disabling...' : 'Disable'}
                        </button>
                    ) : (
                        <button
                            onClick={handleSubscribe}
                            disabled={isLoading || permission === 'denied'}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                        >
                            <FiBell />
                            {isLoading ? 'Enabling...' : 'Enable'}
                        </button>
                    )}
                </div>
            </div>
            
            {permission === 'denied' && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-700">
                        Notification permission was denied. Please enable notifications in your browser settings to receive order alerts.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NotificationSetup; 