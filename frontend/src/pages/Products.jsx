import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/storeContext';
import { FiSearch } from 'react-icons/fi';

const Products = () => {
    const { products } = useStore();
    const [search, setSearch] = useState('');

    // Real-time search filter
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pb-12">
            {/* Hero/Banner */}
            <div className="relative bg-blue-700 py-8 sm:py-12 md:py-16 mb-8 sm:mb-10 shadow-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow">Browse Our Medicines</h1>
                        <p className="text-base sm:text-lg text-blue-100 mb-2 sm:mb-4">Find the best homeopathic remedies, skin care, and oils for your needs.</p>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-2 sm:px-4">
                {/* Search Bar */}
                <form className="flex items-center bg-white rounded-md shadow px-2 sm:px-3 py-2 w-full max-w-md mb-6 sm:mb-8 mx-auto" onSubmit={e => e.preventDefault()}>
                    <FiSearch className="text-blue-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 outline-none bg-transparent text-blue-900 placeholder-blue-300 text-sm sm:text-base"
                    />
                </form>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 text-base sm:text-lg py-12 sm:py-16">No products found.</div>
                    ) : (
                        filteredProducts.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products; 