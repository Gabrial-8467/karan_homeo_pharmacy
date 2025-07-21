import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = 'Name is required';
        if (!formData.email) formErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Email address is invalid';
        if (!formData.password) formErrors.password = 'Password is required';
        else if (formData.password.length < 6) formErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = 'Passwords do not match';
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});
        setIsLoading(true);

        const success = await register(formData.name, formData.email, formData.password);
        
        setIsLoading(false);
        if (success) {
            navigate('/'); // Redirect to home on successful registration
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create a new account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            name="name"
                            type="text"
                            required
                            className={`w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            required
                            className={`w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            name="password"
                            type="password"
                            required
                            className={`w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className={`w-full pl-10 pr-3 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Creating account...' : (
                                <>
                                    <FiUserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 