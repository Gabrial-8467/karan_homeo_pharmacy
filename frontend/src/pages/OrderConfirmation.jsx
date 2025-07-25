import { FiCheckCircle, FiShoppingCart, FiPrinter } from 'react-icons/fi';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [validOrder, setValidOrder] = useState(order);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && (order._id || order.id)) {
      setLoading(true);
      api.get(`/orders/${order._id || order.id}`)
        .then(res => {
          if (res.data.data && res.data.data.orderStatus !== 'Cancelled') {
            setValidOrder(res.data.data);
          } else {
            setValidOrder(null);
          }
        })
        .catch(() => setValidOrder(null))
        .finally(() => setLoading(false));
    } else {
      setValidOrder(null);
    }
  }, [order]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Loading order details...</h2>
      </div>
    );
  }

  if (!validOrder || !validOrder.orderItems) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No order details found.</h2>
        <Link to="/" className="text-blue-700 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const DELIVERY_CHARGE = 50;

  // Enhanced Printable Bill Component
  const PrintableBill = () => (
    <div className="hidden print:block font-sans text-gray-800 p-8">
      <div className="border-b-2 border-gray-300 pb-4 mb-8">
        <h1 className="text-4xl font-bold text-black mb-1">Karan Homeo Pharmacy</h1>
        <p className="text-sm text-gray-600"> Sua Road, near, new railway phatak, Bhai Himmat Singh Nagar, Lapar Market, Baba Deep Singh Nagar, Ludhiana, Punjab 141013</p>
        <p className="text-sm text-gray-600">contact@karanhomeopharmacy.com | +91 7986834022</p>
      </div>

      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="font-bold text-lg mb-2">BILL TO</h3>
          <p>{validOrder.shippingAddress.name}</p>
          <p>{validOrder.shippingAddress.address}</p>
          <p>{validOrder.shippingAddress.city}, {validOrder.shippingAddress.postalCode}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-700 uppercase">Invoice</h2>
          <p className="mt-1">Invoice #: <span className="font-semibold text-black">{validOrder._id}</span></p>
          <p>Date: <span className="font-semibold text-black">{new Date().toLocaleDateString()}</span></p>
        </div>
      </div>

      <table className="w-full text-left mb-10">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="p-3 font-bold uppercase text-sm">Description</th>
            <th className="p-3 font-bold uppercase text-sm text-center">Qty</th>
            <th className="p-3 font-bold uppercase text-sm text-right">Unit Price</th>
            <th className="p-3 font-bold uppercase text-sm text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {validOrder.orderItems && validOrder.orderItems.map((item) => (
            <tr key={item.id || item._id} className="border-b border-gray-200">
              <td className="p-3">{item.name}</td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
              <td className="p-3 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" className="text-right font-bold text-base p-3">Delivery Charges</td>
            <td className="text-right font-bold text-base p-3">₹{DELIVERY_CHARGE.toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-right font-bold text-lg p-3 border-t-2 border-gray-300">
              Grand Total
            </td>
            <td className="text-right font-bold text-lg p-3 border-t-2 border-gray-300">
              ₹{validOrder.totalPrice ? validOrder.totalPrice.toFixed(2) : '0.00'}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="text-center text-sm text-gray-600">
        <p className="font-bold">Thank you for your business!</p>
        <p>If you have any questions concerning this invoice, please contact us.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4 md:p-8 flex items-center justify-center print:block print:bg-white print:p-0">
      {/* Printable Bill - Hidden on screen, enhanced version */}
      <PrintableBill />

      {/* On-screen Confirmation - Hidden on print */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-8 border-t-4 border-green-500 print:hidden">
        <div className="text-center">
          <FiCheckCircle className="text-green-500 text-4xl sm:text-6xl mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600 mb-2">Thank You For Your Order!</h2>
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">Your order has been placed successfully. Order ID: <strong>{validOrder._id}</strong></p>
        </div>

        {/* --- Order Details (Styled for both screen and print) --- */}
        <div className="text-left border-t pt-4 sm:pt-6 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">Order Summary</h3>
          <div className="space-y-3 sm:space-y-4">
            {validOrder.orderItems && validOrder.orderItems.map((item) => (
              <div key={item.id || item._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm sm:text-base"> ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3 sm:mt-4 text-base sm:text-lg">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span> ₹{validOrder.totalPrice ? (validOrder.totalPrice - DELIVERY_CHARGE).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Delivery Charges</span>
                <span> ₹{DELIVERY_CHARGE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 border-t pt-2">
                <span>Grand Total</span>
                <span> ₹{validOrder.totalPrice ? validOrder.totalPrice.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left border-t pt-4 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4">Shipping to:</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <p className="font-semibold text-sm sm:text-base">{validOrder.shippingAddress.name}</p>
            <p className="text-sm sm:text-base">{validOrder.shippingAddress.address}</p>
            <p className="text-sm sm:text-base">{validOrder.shippingAddress.city}, {validOrder.shippingAddress.postalCode}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Link to="/products" className="inline-block bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-blue-800 transition shadow-lg text-sm sm:text-base">
            <FiShoppingCart className="inline mr-2" /> Continue Shopping
          </Link>
          <button
            onClick={handlePrint}
            className="inline-block bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition shadow-lg text-sm sm:text-base"
          >
            <FiPrinter className="inline mr-2" /> Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 