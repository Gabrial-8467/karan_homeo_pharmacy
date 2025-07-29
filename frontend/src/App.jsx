import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory'; // Import the new page
import NotFound from './pages/NotFound'; // Import the 404 page
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/storeContext';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import'./index.css';
import { Analytics } from '@vercel/analytics/react';

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
          <Footer />
          <Analytics />
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
