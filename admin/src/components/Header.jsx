import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const { user, logout } = useAuth();

    const getPageTitle = () => {
        const path = location.pathname.split('/')[1] || 'dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b">
            {/* Hamburger for mobile */}
            <button className="md:hidden text-2xl text-blue-700 mr-2" onClick={toggleSidebar}>
                <FiMenu />
            </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 font-inter">{getPageTitle()}</h1>
        </header>
    );
};

export default Header; 