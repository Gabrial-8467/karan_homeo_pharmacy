import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FiHome, FiShoppingCart, FiUser, FiUserPlus, FiPackage, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { GiMedicines } from 'react-icons/gi';
import { useStore } from '../context/storeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cart } = useStore();
    const { user, logout } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLinkClick = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md py-4 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-50">
            <div className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <GiMedicines className="text-blue-700" size={28} />
                <Link to="/">Karan Homeo Pharmacy</Link>
            </div>
            {/* Desktop Links */}
            <div className="hidden md:flex gap-6 items-center text-lg">
                <Link to="/" className="hover:text-blue-700 font-medium flex items-center gap-1">
                    <FiHome /> Home
                </Link>
                <Link to="/products" className="hover:text-blue-700 font-medium flex items-center gap-1">
                    <GiMedicines /> Products
                </Link>
                <Link to="/cart" className="relative hover:text-blue-700 font-medium flex items-center gap-1">
                    <FiShoppingCart /> Cart
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                            {cartItemCount}
                        </span>
                    )}
                </Link>
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className="hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <FiUser /> {user.name || 'Account'} <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <Link to="/profile" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                        <FiUser className="inline mr-2" /> My Profile
                                    </Link>
                                    <Link to="/order-history" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                        <FiPackage className="inline mr-2" /> Order History
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                        <FiLogOut className="inline mr-2" /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-blue-700 font-medium flex items-center gap-1">
                            <FiUser /> Login
                        </Link>
                        <Link to="/register" className="hover:text-blue-700 font-medium flex items-center gap-1">
                            <FiUserPlus /> Register
                        </Link>
                    </>
                )}
            </div>
            {/* Hamburger for mobile */}
            <button className="md:hidden text-2xl text-blue-700 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div ref={mobileMenuRef} className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end md:hidden">
                    <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col gap-4 animate-slide-in-right relative">
                        <button className="absolute top-4 right-4 text-2xl text-blue-700" onClick={() => setMobileMenuOpen(false)}><FiX /></button>
                        <Link to="/" onClick={handleLinkClick} className="hover:text-blue-700 font-medium flex items-center gap-2 text-lg">
                            <FiHome /> Home
                        </Link>
                        <Link to="/products" onClick={handleLinkClick} className="hover:text-blue-700 font-medium flex items-center gap-2 text-lg">
                            <GiMedicines /> Products
                        </Link>
                        <Link to="/cart" onClick={handleLinkClick} className="relative hover:text-blue-700 font-medium flex items-center gap-2 text-lg">
                            <FiShoppingCart /> Cart
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="hover:text-blue-700 font-medium flex items-center gap-2 text-lg">
                                    <FiUser /> {user.name || 'Account'} <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="ml-4 flex flex-col gap-1">
                                        <Link to="/profile" onClick={handleLinkClick} className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded">
                                            <FiUser className="inline mr-2" /> My Profile
                                        </Link>
                                        <Link to="/order-history" onClick={handleLinkClick} className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded">
                                            <FiPackage className="inline mr-2" /> Order History
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded">
                                            <FiLogOut className="inline mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" onClick={handleLinkClick} className="hover:text-blue-700 font-medium flex items-center gap-2 text-lg">
                                    <FiUser /> Login
                                </Link>
                                <Link to="/register" onClick={handleLinkClick} className="hover:text-blue-700 font-medium flex items-center gap-2 text-lg">
                                    <FiUserPlus /> Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 