import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/storeContext';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import'./index.css';
import { Analytics } from '@vercel/analytics/react';
import PerformanceMonitor from './components/PerformanceMonitor';

// Lazy load all pages except Home for better FCP
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/order-history" element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              } />
              {/* 404 Catch-all route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <Analytics />
          {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
