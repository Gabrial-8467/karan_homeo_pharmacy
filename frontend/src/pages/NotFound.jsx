import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Icon/Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="text-blue-600" size={48} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl font-extrabold text-blue-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition shadow-lg"
          >
            <FiHome className="mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition shadow-lg"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Try these popular pages:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              All Products
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/cart"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Shopping Cart
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;