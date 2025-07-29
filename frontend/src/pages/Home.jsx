import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiTruck, FiShield, FiCreditCard } from 'react-icons/fi';
import { useStore } from '../context/storeContext';

const Home = () => {
    const { products, categories } = useStore();

    // Display all categories found in the products
    const displayedCategories = categories;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-10 sm:py-16 md:py-20 max-w-6xl mx-auto gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow leading-tight">
                        Your Trusted <span className="text-blue-600">Homeopathic</span> Pharmacy
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
                        Discover a wide range of genuine homeopathic medicines, delivered fast and securely to your doorstep. Experience holistic healing with Karan Homeo Pharmacy.
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-blue-800 transition shadow-lg"
                    >
                        Shop All Products
                    </Link>
                </div>
            </section>
            {/* Trust Badges / Benefits */}
            <section className="w-full max-w-4xl px-3 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="flex flex-col items-center text-center">
                    <FiShield className="text-blue-700 mb-2" size={28} />
                    <span className="font-semibold text-blue-800 text-xs sm:text-base">100% Genuine Medicines</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <FiTruck className="text-blue-700 mb-2" size={28} />
                    <span className="font-semibold text-blue-800 text-xs sm:text-base">Fast & Safe Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <FiCreditCard className="text-blue-700 mb-2" size={28} />
                    <span className="font-semibold text-blue-800 text-xs sm:text-base">Secure Payment</span>
                </div>
            </section>
            {/* Shop by Category */}
            <section className="w-full max-w-6xl px-3 sm:px-8 py-8 sm:py-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 sm:mb-8 text-center tracking-tight drop-shadow">Shop by Category</h2>
                <div className="space-y-8 sm:space-y-12">
                    {displayedCategories.map((cat) => (
                        <div key={cat._id} className="mb-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6">{cat.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                                {products
                                    .filter(p => Array.isArray(p.categories) && p.categories.includes(cat.name))
                                    .slice(0, 8)
                                    .map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
export default Home; 