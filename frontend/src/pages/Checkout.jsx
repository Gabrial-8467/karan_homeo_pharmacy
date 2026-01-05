import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/storeContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, clearCart, fetchProducts } = useStore();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        paymentMethod: 'COD'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.fullName) formErrors.fullName = 'Full Name is required';
        if (!formData.address) formErrors.address = 'Address is required';
        if (!formData.city) formErrors.city = 'City is required';
        if (!formData.state) formErrors.state = 'State is required';
        if (!formData.postalCode) formErrors.postalCode = 'Postal Code is required';
        if (!formData.phone) formErrors.phone = 'Phone number is required';
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to place an order.');
            navigate('/login');
            return;
        }

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);

        const orderData = {
            orderItems: cart.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            })),
            shippingAddress: {
                fullName: formData.fullName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                phone: formData.phone
            },
            paymentMethod: formData.paymentMethod,
        };

        try {
            const response = await api.post('/orders', orderData);
            clearCart();
            toast.success('Order placed successfully!');
            await fetchProducts(); // Refetch products to update stock
            navigate('/order-confirmation', { state: { order: response.data.data } });
        } catch (error) {
            console.error('Failed to place order:', error);
            const message = error.response?.data?.message || 'Could not place order. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_PLACEHOLDER";

    const handleRazorpayPayment = async () => {
        if (!user) {
            toast.error('You must be logged in to pay.');
            navigate('/login');
            return;
        }
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            // Create Razorpay order on backend
            const { data: order } = await api.post('/payment/create-order', {
                amount: total,
                receipt: `order_rcptid_${Date.now()}`
            });
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Karan Homeo Pharmacy",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response) {
                    toast.success('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                    // Place order with payment method as 'Razorpay'
                    await handleSubmitRazorpay(response);
                },
                prefill: {
                    name: formData.fullName,
                    email: user?.email || '',
                    contact: formData.phone
                },
                theme: { color: "#3399cc" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Failed to initiate payment.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitRazorpay = async (razorpayResponse) => {
        // Place order with payment method as Razorpay
        const orderData = {
            orderItems: cart.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            })),
            shippingAddress: {
                fullName: formData.fullName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                phone: formData.phone
            },
            paymentMethod: 'Razorpay',
            paymentResult: razorpayResponse
        };
        try {
            const response = await api.post('/orders', orderData);
            clearCart();
            toast.success('Order placed successfully!');
            await fetchProducts();
            navigate('/order-confirmation', { state: { order: response.data.data } });
        } catch (error) {
            toast.error('Order placement failed after payment.');
        }
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-12">
                {/* Shipping Details Form */}
                <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Shipping Information</h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className={`w-full p-2 sm:p-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm sm:text-base`} />
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                            
                            <input type="text" name="address" placeholder="Address" onChange={handleChange} className={`w-full p-2 sm:p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm sm:text-base`} />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <input type="text" name="city" placeholder="City" onChange={handleChange} className={`w-full p-2 sm:p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm sm:text-base`} />
                                <input type="text" name="state" placeholder="State" onChange={handleChange} className={`w-full p-2 sm:p-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm sm:text-base`} />
                            </div>
                             {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                             {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleChange} className={`w-full p-2 sm:p-3 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm sm:text-base`} />
                                <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className={`w-full p-2 sm:p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm sm:text-base`} />
                            </div>
                            {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}
                             {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                        </div>
                        {/* PAYMENT METHOD */}
                        <h3 className="text-lg sm:text-xl font-semibold mt-6 sm:mt-8 mb-2 sm:mb-4">Payment Method</h3>
                        <div className="space-y-2 sm:space-y-4">
                            <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-md cursor-pointer">
                                <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="ml-3 text-gray-700 text-sm sm:text-base">Cash on Delivery (COD)</span>
                            </label>
                            {/* <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-md cursor-pointer">
                                <input type="radio" name="paymentMethod" value="Razorpay" checked={formData.paymentMethod === 'Razorpay'} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                <span className="ml-3 text-gray-700 text-sm sm:text-base">PAY VIA RAZORPAY</span>
                            </label> */}
                        </div>

                         { /* {formData.paymentMethod === 'Razorpay' ? (
                            <button type="button" disabled={isLoading || cart.length === 0} onClick={handleRazorpayPayment} className="w-full mt-6 sm:mt-8 bg-green-600 text-white py-2.5 sm:py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-green-700 disabled:bg-green-300">
                                {isLoading ? 'Processing Payment...' : 'Pay with Razorpay'}
                            </button>
                        ) : ( 
                            <button type="submit" disabled={isLoading || cart.length === 0} className="w-full mt-6 sm:mt-8 bg-blue-600 text-white py-2.5 sm:py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {isLoading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        )} */}
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Order Summary</h2>
                    <div className="space-y-3 sm:space-y-4">
                        {cart.map(item => (
                            <div key={item._id} className="flex justify-between items-center text-sm sm:text-base">
                                <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4 sm:my-6" />
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg sm:text-xl font-bold">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Checkout; 

