import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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

    // Refactored: fetchProducts function
    const fetchProducts = async () => {
        try {
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
        }
    };

    // Call fetchProducts on mount
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
        setCart(prevCart => {
            const itemToRemove = prevCart.find(item => item._id === productId);
            if (itemToRemove) {
                toast.error(`${itemToRemove.name} removed from cart.`);
            }
            return prevCart.filter(item => item._id !== productId);
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
        toast.success('Cart has been cleared.');
    };

    const store = {
        products,
        categories,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        fetchProducts, // Export fetchProducts in context
    };

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
