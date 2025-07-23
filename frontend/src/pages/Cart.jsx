import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../context/storeContext';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, updateCartQuantity, removeFromCart } = useStore();
    const navigate = useNavigate();

    const subtotal = cart.reduce((sum, item) => {
        if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
            return sum + item.price * item.quantity;
        }
        return sum;
    }, 0);

    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error('Your cart is empty. Please add items to proceed.');
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 text-center p-6 sm:p-8">
                <FiShoppingCart className="text-6xl sm:text-8xl text-blue-200 mb-6" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 text-sm sm:text-base">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/products"
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg text-base sm:text-lg"
                >
                    <FiArrowLeft /> Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-2 sm:p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-4 sm:mb-8">Shopping Cart</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-3 sm:p-6 space-y-3 sm:space-y-4">
                        {cart
                            .filter(item => item && item._id && typeof item.price === 'number' && typeof item.quantity === 'number')
                            .map(item => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-gray-200 pb-4 last:border-b-0">
                                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-gray-100 p-1" />
                                        <div>
                                            <h3 className="font-semibold text-base sm:text-lg text-gray-800">{item.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                        <div className="flex items-center border border-gray-200 rounded-md">
                                            <button onClick={() => updateCartQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition" disabled={item.quantity <= 1}>
                                                <FiMinus size={16} />
                                            </button>
                                            <span className="px-3 sm:px-4 font-semibold">{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition">
                                                <FiPlus size={16} />
                                            </button>
                                        </div>
                                        <p className="font-bold text-base sm:text-lg w-20 sm:w-24 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-28">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b pb-3 sm:pb-4 mb-3 sm:mb-4">Order Summary</h2>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                                    <span>Shipping</span>
                                    <span className="font-medium">₹{shipping.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t my-3 sm:my-4"></div>
                            <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full mt-4 sm:mt-6 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md disabled:bg-gray-300"
                                disabled={cart.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 