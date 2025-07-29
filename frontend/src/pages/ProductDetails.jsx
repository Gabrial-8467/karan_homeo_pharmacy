import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiPlus, FiMinus, FiShare2, FiLoader } from 'react-icons/fi';
import { useStore } from '../context/storeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { cart, addToCart, updateCartQuantity, products } = useStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError('Failed to fetch product details.');
        toast.error('Could not load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const cartItem = cart.find(item => item._id === id);
  const isInCart = !!cartItem;

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);


  const handleAddToCart = () => {
    if (!product) return;
    if (isInCart) {
      updateCartQuantity(product._id, quantity);
      toast.success(`${product.name} quantity updated in cart.`);
    } else {
      addToCart(product, quantity);
    }
  };

  // Utility to render description with headings, bullets, paragraphs, and bold text
  function renderDescription(description) {
    if (!description) return null;
    const lines = description.split('\n');
    const elements = [];
    let currentList = [];

    // Helper to render bold text
    const renderBold = (text, keyPrefix = '') => {
      // Replace **bold** or __bold__ with <strong>bold</strong>
      const regex = /\*\*(.*?)\*\*|__(.*?)__/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      let idx = 0;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }
        parts.push(<strong key={`${keyPrefix}-b-${idx}`}>{match[1] || match[2]}</strong>);
        lastIndex = regex.lastIndex;
        idx++;
      }
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }
      return parts.length > 0 ? parts : text;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      // Headings
      if (/^###\s+/.test(trimmed)) {
        if (currentList.length) {
          elements.push(
            <ul key={`ul-${idx}`} className="list-disc list-inside mb-2">
              {currentList.map((item, j) => <li key={`li-${idx}-${j}`}>{renderBold(item, `li-${idx}-${j}`)}</li>)}
            </ul>
          );
          currentList = [];
        }
        elements.push(<h3 key={`h3-${idx}`} className="text-lg font-bold mb-2">{renderBold(trimmed.replace(/^###\s+/, ''), `h3-${idx}`)}</h3>);
      } else if (/^##\s+/.test(trimmed)) {
        if (currentList.length) {
          elements.push(
            <ul key={`ul-${idx}`} className="list-disc list-inside mb-2">
              {currentList.map((item, j) => <li key={`li-${idx}-${j}`}>{renderBold(item, `li-${idx}-${j}`)}</li>)}
            </ul>
          );
          currentList = [];
        }
        elements.push(<h2 key={`h2-${idx}`} className="text-xl font-bold mb-2">{renderBold(trimmed.replace(/^##\s+/, ''), `h2-${idx}`)}</h2>);
      } else if (/^#\s+/.test(trimmed)) {
        if (currentList.length) {
          elements.push(
            <ul key={`ul-${idx}`} className="list-disc list-inside mb-2">
              {currentList.map((item, j) => <li key={`li-${idx}-${j}`}>{renderBold(item, `li-${idx}-${j}`)}</li>)}
            </ul>
          );
          currentList = [];
        }
        elements.push(<h1 key={`h1-${idx}`} className="text-2xl font-bold mb-2">{renderBold(trimmed.replace(/^#\s+/, ''), `h1-${idx}`)}</h1>);
      } else if (/^[-*•]\s+/.test(trimmed)) {
        currentList.push(trimmed.replace(/^[-*•]\s+/, ''));
      } else if (trimmed) {
        if (currentList.length) {
          elements.push(
            <ul key={`ul-${idx}`} className="list-disc list-inside mb-2">
              {currentList.map((item, j) => <li key={`li-${idx}-${j}`}>{renderBold(item, `li-${idx}-${j}`)}</li>)}
            </ul>
          );
          currentList = [];
        }
        elements.push(<p key={`p-${idx}`} className="mb-2">{renderBold(trimmed, `p-${idx}`)}</p>);
      }
    });
    if (currentList.length) {
      elements.push(
        <ul key={`ul-last`} className="list-disc list-inside mb-2">
          {currentList.map((item, j) => <li key={`li-last-${j}`}>{renderBold(item, `li-last-${j}`)}</li>)}
        </ul>
      );
    }
    return <div>{elements}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FiLoader className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p>Product not found.</p>
      </div>
    );
  }

  // Related products: same categories, not the current product
  const relatedProducts = products
    .filter(p => {
      if (p._id === product._id) return false;
      if (!Array.isArray(p.categories) || !Array.isArray(product.categories)) return false;
      return p.categories.some(cat => product.categories.includes(cat));
    })
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Product Image */}
        <div className="flex justify-center items-start">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-24">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-auto max-w-sm object-contain"
            />
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          {product.manufacturer && (
            <p className="text-sm text-gray-400 mb-2">by {product.manufacturer}</p>
          )}

          {product.usage && (
            <div className="mb-4">
              <h3 className="font-semibold text-blue-700 mb-1">How to take</h3>
              <p className="text-gray-700 text-base">{product.usage}</p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
          </div>

          {renderDescription(product.description)}

          <p className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">₹{product.price}</p>

          {/* Highlights & Ingredients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {product.highlights && product.highlights.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Highlights</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {product.ingredients.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Add to Cart Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center justify-between border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-3 text-gray-700 hover:bg-gray-100 rounded-l-lg"
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className="px-5 font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="p-3 text-gray-700 hover:bg-gray-100 rounded-r-lg"
              >
                <FiPlus />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-grow flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              <FiShoppingCart size={20} />
              <span>{isInCart ? 'Update Cart' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {products.length > 0 && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rp => (
              <div key={rp._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <Link to={`/products/${rp._id}`} className="block">
                  <div className="p-4 bg-gray-50 flex justify-center items-center">
                    <img src={getImageUrl(rp.image)} alt={rp.name} className="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate" title={rp.name}>{rp.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-[40px]" title={rp.description}>
                      {rp.description
                        ? rp.description
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
                    <p className="text-blue-600 font-bold mt-1">₹{rp.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails; 