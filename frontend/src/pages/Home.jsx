import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiTruck, FiShield, FiCreditCard, FiUser, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { useStore } from '../context/storeContext';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Home = () => {
    const { products, categories, loading } = useStore();

    // Display all categories found in the products
    const displayedCategories = categories;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex flex-col items-center">
            {/* Hero Section - Always visible for better FCP */}
            <section className="w-full flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-10 sm:py-16 md:py-20 max-w-6xl mx-auto gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow leading-tight">
                        Best <span className="text-blue-600">Homeopathy Clinic</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
                        Expert homeopathic doctor consultation, genuine medicines, and natural treatment. Leading homeopathy clinic in Ludhiana for holistic healing and wellness.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/products"
                            className="inline-block bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-semibold text-base sm:text-lg hover:bg-blue-800 transition shadow-lg"
                        >
                            Shop All Products
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Trust Badges / Benefits - Always visible */}
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

            {/* SEO Content Section - Homeopathy Clinic Information */}
            <section className="w-full max-w-6xl px-3 sm:px-8 py-8 sm:py-12">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">Why Choose Our Homeopathy Clinic?</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Genuine Medicines:</strong> 100% authentic homeopathic remedies and medicines</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Holistic Treatment:</strong> Natural healing approach treating root causes</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>Personalized Care:</strong> Individual treatment plans for each patient</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span><strong>No Side Effects:</strong> Safe and gentle homeopathic treatment</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">Clinic Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <FiMapPin className="text-blue-600 mr-3" />
                                    <div>
                                        <p className="font-semibold">Address</p>
                                        <p className="text-sm text-gray-600">Sua Road, near new railway phatak, Bhai Himmat Singh Nagar, Ludhiana, Punjab 141013</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FiPhone className="text-blue-600 mr-3" />
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <p className="text-sm text-gray-600">+91 7986834022</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="text-blue-600 mr-3" />
                                    <div>
                                        <p className="font-semibold">Timings</p>
                                        <p className="text-sm text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FiUser className="text-blue-600 mr-3" />
                                    <div>
                                        <p className="font-semibold">Doctor</p>
                                        <p className="text-sm text-gray-600">Dr. Renu Bala - Expert Homeopathic Doctor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Shop by Category - Show loading or content */}
            <section className="w-full max-w-6xl px-3 sm:px-8 py-8 sm:py-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 sm:mb-8 text-center tracking-tight drop-shadow">PRODUCTS</h2>
                
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="space-y-8 sm:space-y-12">
                        {displayedCategories.length > 0 ? (
                            displayedCategories.map((cat) => (
                                <div key={cat._id} className="mb-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6">{cat.name}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-8">
                                        {products
                                            .filter(p => Array.isArray(p.categories) && p.categories.includes(cat.name))
                                            .slice(0, 6)
                                            .map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">No products available at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Additional SEO Content - Homeopathy Treatment Information */}
            <section className="w-full max-w-6xl px-3 sm:px-8 py-8 sm:py-12">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
                        Homeopathic Treatment & Consultation
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">What is Homeopathy?</h3>
                            <p className="text-gray-700 mb-4">
                                Homeopathy is a natural system of medicine that uses highly diluted substances to trigger the body's natural healing processes. 
                                It treats the whole person, not just the symptoms, providing holistic healing and wellness.
                            </p>
                            <h4 className="font-semibold text-blue-600 mb-2">Benefits of Homeopathic Treatment:</h4>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Natural and gentle healing approach</li>
                                <li>• No harmful side effects</li>
                                <li>• Treats root cause of diseases</li>
                                <li>• Suitable for all age groups</li>
                                <li>• Individualized treatment plans</li>
                                <li>• Long-term health benefits</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-blue-600 mb-4">Our Treatment Approach</h3>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h4 className="font-semibold text-blue-600">Initial Consultation</h4>
                                    <p className="text-sm text-gray-700">Comprehensive health assessment and detailed case taking</p>
                                </div>
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h4 className="font-semibold text-blue-600">Personalized Treatment</h4>
                                    <p className="text-sm text-gray-700">Customized homeopathic remedies based on individual symptoms</p>
                                </div>
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h4 className="font-semibold text-blue-600">Follow-up Care</h4>
                                    <p className="text-sm text-gray-700">Regular monitoring and treatment adjustments for optimal results</p>
                                </div>
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <h4 className="font-semibold text-blue-600">Natural Medicines</h4>
                                    <p className="text-sm text-gray-700">Genuine homeopathic remedies for effective healing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home; 