import { useEffect, useState } from 'react';
import { FiEye, FiTrash2, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api` });

const STATUS_OPTIONS = [
    'Processing',
    'Confirmed',
    'Shipped',
    'Delivered',
    'Cancelled',
];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/admin/all');
            setOrders(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setStatusLoading(true);
        try {
            await api.put(`/orders/admin/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setStatusLoading(false);
        }
    };

    const handleDelete = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete/cancel this order?')) return;
        try {
            await api.delete(`/orders/admin/${orderId}`);
            toast.success('Order deleted!');
            fetchOrders();
        } catch (err) {
            toast.error('Failed to delete order');
        }
    };

    return (
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Orders</h1>
                <button onClick={fetchOrders} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded hover:bg-blue-200 transition text-sm sm:text-base"><FiRefreshCw /> Refresh</button>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-6">Loading...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-6 text-gray-400">No orders found.</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 font-mono text-xs text-gray-700">{order._id}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4">{order.user?.name || 'N/A'}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                                        <select
                                            value={order.orderStatus}
                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                            className="p-2 border rounded bg-gray-50 text-xs sm:text-base"
                                            disabled={statusLoading}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 font-semibold">₹{order.totalPrice.toFixed(2)}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-center flex gap-2 justify-center">
                                        <button onClick={() => handleViewDetails(order)} className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"><FiEye /></button>
                                        <button onClick={() => handleDelete(order._id)} className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-700"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-2xl relative">
                        <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiX size={24} /></button>
                        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Order Details</h2>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Order ID:</span> <span className="font-mono text-xs">{selectedOrder._id}</span>
                        </div>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Customer:</span> {selectedOrder.user?.name || 'N/A'}
                        </div>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}
                        </div>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Status:</span> {selectedOrder.orderStatus}
                        </div>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Total:</span> ₹{selectedOrder.totalPrice.toFixed(2)}
                        </div>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Shipping Address:</span>
                            <div className="ml-2 sm:ml-4 text-gray-700 text-xs sm:text-base">
                                {selectedOrder.shippingAddress?.fullName}<br/>
                                {selectedOrder.shippingAddress?.address}<br/>
                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}<br/>
                                Phone: {selectedOrder.shippingAddress?.phone}
                            </div>
                        </div>
                        <div className="mb-2 sm:mb-4">
                            <span className="font-semibold">Items:</span>
                            <table className="w-full mt-2 text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-2 text-left">Product</th>
                                        <th className="p-2 text-left">Qty</th>
                                        <th className="p-2 text-left">Price</th>
                                        <th className="p-2 text-left">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2">{item.quantity}</td>
                                            <td className="p-2">₹{item.price.toFixed(2)}</td>
                                            <td className="p-2">₹{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders; 