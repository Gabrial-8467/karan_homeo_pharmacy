import { useEffect, useState } from 'react';
import { FiEye, FiPackage, FiLoader } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/myorders');
                setOrders(response.data.data);
            } catch (error) {
                console.error('Failed to fetch order history:', error);
                toast.error('Could not load your order history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <FiLoader className="animate-spin text-blue-500 text-4xl" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <FiPackage className="text-8xl text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-8">You haven't placed any orders with us yet. Start shopping to see your history here.</p>
                <Link
                    to="/products"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-8">My Order History</h1>
                <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-2 sm:px-6 py-2 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-mono text-gray-500">{order._id}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-semibold text-gray-900"> ₹{order.totalPrice.toFixed(2)}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                        <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center">
                                        <Link to={`/order-confirmation`} state={{ order: order }} className="text-blue-600 hover:text-blue-800 hover:underline">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory; 