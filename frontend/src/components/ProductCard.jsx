import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import { useStore } from '../context/storeContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateCartQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <Link to={`/products/${product._id}`} className="block">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-40 object-contain p-4 bg-gray-50"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product._id}`} className="block mb-2 flex-grow">
          <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-blue-600 transition" title={product.name}>
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-[40px]" title={product.description}>
            {product.description}
          </p>
        </Link>
        <div className="flex justify-between items-center mt-auto pt-2">
          <p className="text-xl font-extrabold text-blue-700">₹{product.price}</p>
          {!isAdding && !isInCart && (
            <button
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition shadow group-hover:scale-105 mt-2"
              onClick={() => {
                if (product.stock > 0) {
                  handleInitialAdd();
                } else {
                  toast.error('Out of stock!');
                }
              }}
              disabled={product.stock === 0}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          )}
          {isInCart && (
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                onClick={() => updateCartQuantity(product._id, Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className="font-semibold text-gray-700 w-8 text-center text-lg">{quantity}</span>
              <button
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                onClick={() => {
                  if (quantity < product.stock) {
                    updateCartQuantity(product._id, quantity + 1);
                  } else {
                    toast.error('Cannot add more than available stock!');
                  }
                }}
                disabled={quantity >= product.stock}
              >
                <FiPlus />
              </button>
            </div>
          )}
        </div>
      </div>
      {product.stock > 0 && product.stock <= 10 && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
              Only {product.stock} left in stock!
          </div>
      )}
      {isAdding && (
          <div className="absolute inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center rounded-lg">
              <p className="text-white text-lg font-semibold">Added!</p>
          </div>
      )}
    </div>
  );
};

export default ProductCard; 