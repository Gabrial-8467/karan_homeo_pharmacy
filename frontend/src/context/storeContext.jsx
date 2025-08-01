import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); // Changed to false for better FCP
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (!savedCart) return [];

            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
                // Filter out any invalid items that don't conform to the new structure
                const validCart = parsedCart.filter(item =>
                    item && item._id && typeof item.name === 'string' && typeof item.price === 'number' && typeof item.quantity === 'number'
                );

                // If the cart was modified, update local storage to prevent future errors
                if (validCart.length !== parsedCart.length) {
                    localStorage.setItem('cart', JSON.stringify(validCart));
                }

                return validCart;
            }
            return [];
        } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
            return []; // Return empty array on error
        }
    });

    // Optimized: fetchProducts function with non-blocking loading
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsRes = await api.get('/products');
            const fetchedProducts = productsRes.data.data;
            setProducts(fetchedProducts);

            // Dynamically generate categories from products (using categories array)
            const categorySet = new Set();
            fetchedProducts.forEach(p => {
                if (Array.isArray(p.categories)) {
                    p.categories.forEach(cat => {
                        if (cat && cat.trim()) categorySet.add(cat.trim());
                    });
                }
            });
            const generatedCategories = Array.from(categorySet).map(name => ({ _id: name, name }));
            setCategories(generatedCategories);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Could not load products.');
        } finally {
            setLoading(false);
        }
    };

    // Optimized: Fetch products immediately without delay for better UX
    useEffect(() => {
        fetchProducts();
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                toast.success(`${product.name} quantity updated in cart.`);
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            toast.success(`${product.name} added to cart.`);
            return [...prevCart, { ...product, quantity }];
        });
    };

    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
        toast.success('Item removed from cart.');
    };

    const clearCart = () => {
        setCart([]);
        toast.success('Cart cleared.');
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        products,
        categories,
        loading,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        fetchProducts // Expose for manual refresh
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};
