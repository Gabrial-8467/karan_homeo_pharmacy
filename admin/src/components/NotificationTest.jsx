import { useState } from 'react';
import { FiPlay, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import notificationService from '../services/notificationService';

const NotificationTest = () => {
    const [isTesting, setIsTesting] = useState(false);

    const testNotification = async () => {
        setIsTesting(true);
        try {
            console.log('=== Testing Notification System ===');
            
            // Test 1: Check if service worker is supported
            console.log('1. Checking service worker support...');
            const supported = await notificationService.init();
            console.log('Service worker supported:', supported);
            
            if (!supported) {
                toast.error('Service worker not supported');
                return;
            }
            
            // Test 2: Check current permission
            console.log('2. Checking notification permission...');
            const permission = Notification.permission;
            console.log('Current permission:', permission);
            
            if (permission === 'denied') {
                toast.error('Notification permission denied. Please enable in browser settings.');
                return;
            }
            
            // Test 3: Request permission if needed
            if (permission === 'default') {
                console.log('3. Requesting permission...');
                const granted = await notificationService.requestPermission();
                console.log('Permission granted:', granted);
                
                if (!granted) {
                    toast.error('Permission denied');
                    return;
                }
            }
            
            // Test 4: Check existing subscription
            console.log('4. Checking existing subscription...');
            const isSubscribed = await notificationService.checkSubscription();
            console.log('Currently subscribed:', isSubscribed);
            
            // Test 5: Subscribe if not already subscribed
            if (!isSubscribed) {
                console.log('5. Subscribing to notifications...');
                await notificationService.subscribe();
                console.log('Subscription successful');
            }
            
            // Test 6: Send test notification
            console.log('6. Sending test notification...');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Test Notification',
                    body: 'This is a test notification from the admin panel',
                    icon: '/favicon-96x96.png'
                })
            });
            
            if (response.ok) {
                toast.success('Test notification sent! Check your browser notifications.');
            } else {
                const error = await response.json();
                console.error('Test notification error:', error);
                toast.error(`Failed to send test notification: ${error.message}`);
            }
            
        } catch (error) {
            console.error('Test failed:', error);
            toast.error(`Test failed: ${error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FiInfo className="text-blue-600 text-xl" />
                    <div>
                        <h3 className="font-semibold text-blue-900">
                            Notification Debug
                        </h3>
                        <p className="text-sm text-blue-700">
                            Test the notification system and check detailed logs in the browser console
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={testNotification}
                    disabled={isTesting}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                >
                    <FiPlay />
                    {isTesting ? 'Testing...' : 'Run Test'}
                </button>
            </div>
        </div>
    );
};

export default NotificationTest; 