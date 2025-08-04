import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiShoppingCart, FiGitMerge, FiX } from 'react-icons/fi';

const Sidebar = ({ open, onClose }) => {
    const linkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 transition-colors duration-200";
    const activeLinkClasses = "bg-gray-700 border-r-4 border-blue-400";

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden md:flex w-64 bg-gray-800 text-white flex-col h-full">
                <div className="h-20 flex items-center justify-center bg-gray-900">
                    <FiGitMerge size={24} className="text-blue-400" />
                    <h1 className="text-2xl font-bold ml-2 font-quicksand">KHP Admin</h1>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} end>
                        <FiHome className="mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <FiBox className="mr-3" />
                        Products
                    </NavLink>
                    <NavLink to="/orders" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <FiShoppingCart className="mr-3" />
                        Orders
                    </NavLink>
                </nav>
            </div>
            {/* Mobile sidebar overlay */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white flex flex-col transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 md:hidden`}>
                <div className="h-20 flex items-center justify-between bg-gray-900 px-4">
                    <div className="flex items-center">
                        <FiGitMerge size={24} className="text-blue-400" />
                        <h1 className="text-2xl font-bold ml-2 font-quicksand">KHP Admin</h1>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-red-400 text-2xl focus:outline-none">
                        <FiX />
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <NavLink to="/" onClick={onClose} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} end>
                        <FiHome className="mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/products" onClick={onClose} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <FiBox className="mr-3" />
                        Products
                    </NavLink>
                    <NavLink to="/orders" onClick={onClose} className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <FiShoppingCart className="mr-3" />
                        Orders
                    </NavLink>
                </nav>
            </div>
        </>
    );
};

export default Sidebar; 