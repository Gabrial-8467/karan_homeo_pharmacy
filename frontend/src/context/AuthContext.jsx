// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // ✅ Load user from localStorage on first render
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    // ✅ Verify token with backend when app loads
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    setUser(response.data.data);
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Logged in successfully!');
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token, ...userData } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Registered successfully!');
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            return false;
        }
    };

    const updateUserProfile = async (updateData) => {
        try {
            const response = await api.put('/auth/profile', updateData);
            const { token, ...updatedUser } = response.data.data;

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            if (token) {
                localStorage.setItem('token', token);
            }

            toast.success('Profile updated successfully!');
            return true;
        } catch (error) {
            console.error('Profile update failed:', error);
            const message = error.response?.data?.message || 'Profile update failed. Please try again.';
            toast.error(message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('You have been logged out.');
    };

    const auth = {
        user,
        loading,
        login,
        register,
        updateUserProfile,
        logout
    };

    return (
        <AuthContext.Provider value={auth}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
