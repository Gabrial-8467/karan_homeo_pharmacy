import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useStore } from '../context/storeContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateCartQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const cardRef = useRef();

  const cartItem = cart.find(item => item._id === product._id);
  const isInCart = !!cartItem;

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/placeholder-image.png';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000${imagePath}`;
  };

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  const handleUpdate = () => {
    setIsAdding(true);
    updateCartQuantity(product._id, quantity);
    toast.success(`${quantity} x ${product.name} updated in cart!`);
    setTimeout(() => {
        setIsAdding(false);
    }, 1500);
  };

  const handleInitialAdd = () => {
    addToCart(product, 1);
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on a button or inside cart controls
    if (
      e.target.closest('button') ||
      e.target.closest('.cart-controls')
    ) {
      return;
    }
    window.location.href = `/products/${product._id}`;
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="w-full h-40 object-contain p-4 bg-gray-50"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-blue-600 transition" title={product.name}>
          {product.name}
        </h3>
        {product.manufacturer && (
          <p className="text-xs text-gray-400 mb-1">by {product.manufacturer}</p>
        )}
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-[40px]" title={product.description}>
          {product.description
            ? product.description
                .split('\n')
                .filter(line => {
                  const trimmed = line.trim();
                  // Filter out heading lines (lines starting with #)
                  return trimmed && !trimmed.startsWith('#');
                })
                .map(line => line.replace(/^\s*[-*•]\s*/, ''))
                .filter(Boolean)
                .join(' ')
            : ''}
        </p>
        <div className="flex justify-between items-center mt-auto pt-2">
          <p className="text-xl font-extrabold text-blue-700">₹{product.price}</p>
          {!isAdding && !isInCart && (
            <button
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition shadow group-hover:scale-105 mt-2"
              onClick={e => { e.stopPropagation(); handleInitialAdd(); }}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          )}
          {isInCart && (
            <div className="flex items-center border border-gray-300 rounded-md cart-controls">
              <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                onClick={e => { e.stopPropagation(); updateCartQuantity(product._id, Math.max(1, quantity - 1)); }}
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className="font-semibold text-gray-700 w-8 text-center text-lg">{quantity}</span>
              <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                onClick={e => { e.stopPropagation(); updateCartQuantity(product._id, quantity + 1); }}
              >
                <FiPlus />
              </button>
            </div>
          )}
        </div>
      </div>
      {isAdding && (
        <div className="absolute inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center rounded-lg">
          <p className="text-white text-lg font-semibold">Added!</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 