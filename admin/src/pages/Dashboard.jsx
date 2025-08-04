import { useEffect, useState } from 'react';
import { FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api` });

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newOrdersNotification, setNewOrdersNotification] = useState(false);

    useEffect(() => {
        fetchData();

        // Initialize Socket.io connection
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            transports: ['websocket', 'polling']
        });

        // Join admin room
        socket.emit('join-admin');

        // Listen for new orders
        socket.on('new-order', (orderData) => {
            toast.success(`New order received from ${orderData.customerName}! Order ID: ${orderData.orderId}`);
            setNewOrdersNotification(true);
            setTimeout(() => setNewOrdersNotification(false), 5000);

            // Refresh dashboard data
            fetchData();
        });

        // Handle connection events
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/products'),
                api.get('/orders/admin/all'),
            ]);
            setProducts(prodRes.data.data);
            setOrders(orderRes.data.data);
        } catch (err) {
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus === 'Delivered' ? o.totalPrice : 0), 0);
    const recentOrders = orders.slice(0, 10);

    return (
        <div className="p-2 sm:p-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
                <div className="flex items-center gap-3 sm:gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl shadow">
                    <FiPackage className="text-blue-600 text-2xl sm:text-3xl" />
                    <div>
                        <div className="text-lg sm:text-2xl font-bold">{totalProducts}</div>
                        <div className="text-gray-600 text-xs sm:text-base">Products</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 bg-green-50 p-4 sm:p-6 rounded-xl shadow">
                    <FiShoppingCart className="text-green-600 text-2xl sm:text-3xl" />
                    <div>
                        <div className="text-lg sm:text-2xl font-bold">{totalOrders}</div>
                        <div className="text-gray-600 text-xs sm:text-base">Orders</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 bg-yellow-50 p-4 sm:p-6 rounded-xl shadow">
                    <FiDollarSign className="text-yellow-600 text-2xl sm:text-3xl" />
                    <div>
                        <div className="text-lg sm:text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                        <div className="text-gray-600 text-xs sm:text-base">Revenue (Delivered)</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Recent Orders</h2>
                    <table className="w-full text-xs sm:text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 text-left">Order ID</th>
                                <th className="p-2 text-left">Customer</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-4 sm:py-6">Loading...</td></tr>
                            ) : recentOrders.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-4 sm:py-6 text-gray-400">No recent orders.</td></tr>
                            ) : (
                                recentOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="p-2 font-mono text-xs text-gray-700">{order._id}</td>
                                        <td className="p-2">{order.user?.name || 'N/A'}</td>
                                        <td className="p-2">{order.orderStatus}</td>
                                        <td className="p-2 font-semibold">₹{order.totalPrice.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 