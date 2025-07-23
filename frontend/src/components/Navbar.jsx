import { Link, useNavigate } from 'react-router-dom';
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
    const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Logout button clicked');
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
        console.log('Menu link clicked');
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

            {/* Responsive Hamburger Icon (mobile only) */}
            <button
                className="md:hidden text-2xl text-blue-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
            >
                <FiMenu />
            </button>

            {/* Mobile Menu Overlay & Panel */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu overlay"
                    />
                    {/* Slide-in Panel */}
                    <div className="fixed top-0 right-0 h-full w-72 max-w-full bg-white shadow-lg z-50 p-6 flex flex-col gap-6 animate-slide-in-right md:hidden">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xl font-bold text-blue-700 flex items-center gap-2">
                                <GiMedicines className="text-blue-700" size={24} />
                                Karan Homeo Pharmacy
                            </span>
                            <button
                                className="text-2xl text-blue-700 focus:outline-none"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <FiX />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-4 text-lg">
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                <FiHome /> Home
                            </button>
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/products'); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                <GiMedicines /> Products
                            </button>
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/cart'); }} className="flex items-center gap-2 text-left hover:text-blue-700 relative">
                                <FiShoppingCart /> Cart
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            {user ? (
                                <>
                                    <div className="border-t border-gray-200 my-2" />
                                    {/* Collapsible My Account Dropdown */}
                                    <button
                                        onClick={() => setMobileAccountOpen((prev) => !prev)}
                                        className="flex items-center gap-2 text-left hover:text-blue-700 w-full justify-between"
                                        aria-expanded={mobileAccountOpen}
                                        aria-controls="mobile-account-dropdown"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FiUser /> My Account
                                        </span>
                                        <FiChevronDown className={`transition-transform ${mobileAccountOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {mobileAccountOpen && (
                                        <div id="mobile-account-dropdown" className="flex flex-col gap-2 pl-6 mt-2">
                                            <button onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                                <FiUser /> My Profile
                                            </button>
                                            <button onClick={() => { setMobileMenuOpen(false); navigate('/order-history'); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                                <FiPackage /> Order History
                                            </button>
                                            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                                <FiLogOut /> Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="border-t border-gray-200 my-2" />
                                    <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                        <FiUser /> Login
                                    </button>
                                    <button onClick={() => { setMobileMenuOpen(false); navigate('/register'); }} className="flex items-center gap-2 text-left hover:text-blue-700">
                                        <FiUserPlus /> Register
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar; 