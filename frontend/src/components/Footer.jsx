import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';

const Footer = () => (
  <footer className="bg-blue-900 text-white mt-16 pt-10 pb-4 px-2 sm:pt-12 sm:pb-6 sm:px-4 relative overflow-hidden text-sm sm:text-base">
    {/* Subtle top gradient */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 opacity-60" />
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
      {/* Brand & Tagline */}
      <div className="flex-1 mb-8 md:mb-0 flex flex-col gap-2 items-center md:items-start">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white rounded-full p-2"><FiHeart className="text-blue-700" size={24} /></span>
          <span className="text-xl sm:text-2xl font-bold tracking-wide">Karan Homeo Pharmacy</span>
        </div>
        <span className="text-xs sm:text-sm opacity-80 text-center md:text-left">Your trusted online homeopathic pharmacy for genuine medicines and fast delivery.</span>
        <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm opacity-80">
          <FiMapPin size={50}/> Sua Road, near, new railway phatak, Bhai Himmat Singh Nagar, Lapar Market, Baba Deep Singh Nagar, Ludhiana, Punjab 141013
        </div>
      </div>
      {/* Divider for desktop */}
      <div className="hidden md:block w-px bg-blue-800 mx-8" />
      {/* Quick Links */}
      <div className="flex-1 mb-8 md:mb-0 flex flex-col gap-2 items-center md:items-start">
        <span className="font-semibold mb-2">Quick Links</span>
        <Link to="/" className="hover:underline hover:text-blue-300 transition">Home</Link>
        <Link to="/products" className="hover:underline hover:text-blue-300 transition">Products</Link>
        <Link to="/cart" className="hover:underline hover:text-blue-300 transition">Cart</Link>
        <Link to="/login" className="hover:underline hover:text-blue-300 transition">Login</Link>
        <Link to="/register" className="hover:underline hover:text-blue-300 transition">Register</Link>
      </div>
      {/* Divider for desktop */}
      <div className="hidden md:block w-px bg-blue-800 mx-8" />
      {/* Contact & Social + Newsletter */}
      <div className="flex-1 flex flex-col gap-4 items-center md:items-start">
        <span className="font-semibold mb-2">Contact Us</span>
        {/* <div className="flex items-center gap-2 text-xs sm:text-sm"><FiMail /> support@karanhomeopharmacy.com</div> */}
        <div className="flex items-center gap-2 text-xs sm:text-sm"><FiPhone /> +91 7986834022</div>
        <div className="flex gap-4 mt-2 text-xl sm:text-2xl">
          {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-300 transition"><FiFacebook /></a> */}
          <a href="https://www.instagram.com/dr_renu_bala5/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-blue-300 transition"><FiInstagram /></a>
        </div>
        {/* Newsletter mini-form */}
        <form className="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-xs">
          <input
            type="email"
            placeholder="Subscribe for offers"
            className="px-3 py-2 rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 w-full text-xs sm:text-base"
          />
        </form>
      </div>
    </div>
    <div className="max-w-6xl mx-auto flex flex-col justify-center items-center mt-8 pt-6 border-t border-blue-800 text-xs sm:text-sm opacity-80 gap-4 relative z-10">
      <span>&copy; {new Date().getFullYear()} Karan Homeo Pharmacy. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer; 