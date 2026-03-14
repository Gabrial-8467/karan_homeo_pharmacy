import { useEffect, useState } from 'react';
import { FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const api = axios.create({ 
    baseURL: 'https://karan-homeo-pharmacy.onrender.com/api' 
});


const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newOrdersNotification, setNewOrdersNotification] = useState(false);

    useEffect(() => {
        fetchData();

        // WebSocket disabled until backend is available

        return () => {
            // Cleanup if needed
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/products'),
                api.get('/orders/admin/all'),
            ]);
            
            // Check if response is HTML (indicates wrong endpoint)
            if (typeof prodRes.data === 'string' && prodRes.data.includes('<!doctype html>')) {
                throw new Error('Products endpoint is returning HTML instead of JSON');
            }
            if (typeof orderRes.data === 'string' && orderRes.data.includes('<!doctype html>')) {
                throw new Error('Orders endpoint is returning HTML instead of JSON');
            }
            
            // Try different possible response structures
            const productsData = prodRes.data?.data || prodRes.data || [];
            const ordersData = orderRes.data?.data || orderRes.data || [];
            
            setProducts(productsData);
            setOrders(ordersData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            toast.error('Failed to fetch dashboard data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalRevenue = Array.isArray(orders) 
        ? orders.reduce((sum, o) => sum + (o.orderStatus === 'Delivered' ? o.totalPrice : 0), 0) 
        : 0;
    const recentOrders = Array.isArray(orders) ? orders.slice(0, 10) : [];

    return (
        <div className="p-2 sm:p-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
                <div className="flex items-center gap-3 sm:gap-4 bg-blue-50 p-4 sm:p-6 rounded-xl shadow-lg">
                    <FiPackage className="text-blue-600 text-2xl sm:text-3xl" />
                    <div>
                        <div className="text-lg sm:text-2xl font-bold">{totalProducts}</div>
                        <div className="text-gray-600 text-xs sm:text-base">Products</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 bg-green-50 p-4 sm:p-6 rounded-xl shadow-lg">
                    <FiShoppingCart className="text-green-600 text-2xl sm:text-3xl" />
                    <div>
                        <div className="text-lg sm:text-2xl font-bold">{totalOrders}</div>
                        <div className="text-gray-600 text-xs sm:text-base">Orders</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg">
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