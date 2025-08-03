import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({ 
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
    timeout: 10000 // 10 second timeout
});

// Helper to get correct image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
};

// Skeleton loader component
const ProductSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded"></div>
        </td>
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
        </td>
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="h-4 bg-gray-200 rounded w-28"></div>
        </td>
        <td className="px-2 sm:px-6 py-2 sm:py-4">
            <div className="flex gap-2 justify-center">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
        </td>
    </tr>
);

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
        manufacturer: '',
        usage: '',
        categories: '',
    });
    const [addLoading, setAddLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const fileInputRef = useRef();

    // Memoized fetch function with pagination
    const fetchProducts = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50', // Load more products per page
                ...(search && { search })
            });
            
            const res = await api.get(`/products?${params}`);
            setProducts(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Search functionality with debouncing
    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        
        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout for debounced search
        const timeout = setTimeout(() => {
            fetchProducts(1, value);
        }, 300);
        
        setSearchTimeout(timeout);
    }, [fetchProducts, searchTimeout]);

    // Memoized handlers for better performance
    const handleEditClick = useCallback((product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description || '',
            manufacturer: product.manufacturer || '',
            usage: product.usage || '',
            categories: Array.isArray(product.categories) ? product.categories.join(', ') : '',
        });
        setShowEditModal(true);
    }, []);

    const handleEditChange = useCallback((e) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleEditSave = useCallback(async () => {
        try {
            const updatedData = {
                ...editForm,
                price: Number(editForm.price),
                categories: editForm.categories.split(',').map(c => c.trim()).filter(Boolean),
            };
            await api.put(`/products/${editingProduct._id}`, updatedData);
            toast.success('Product updated!');
            setShowEditModal(false);
            fetchProducts();
        } catch (err) {
            toast.error('Failed to update product');
        }
    }, [editForm, editingProduct, fetchProducts]);

    // Delete product
    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted!');
            fetchProducts();
        } catch (err) {
            toast.error('Failed to delete product');
        }
    }, [fetchProducts]);

    // Add product
    const handleAddChange = useCallback((e) => {
        setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    // Image upload handler
    const handleImageUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAddForm((prev) => ({ ...prev, image: res.data.url }));
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error('Image upload failed');
        }
    }, []);

    const handleAddProduct = useCallback(async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            await api.post('/products', {
                ...addForm,
                price: Number(addForm.price),
                categories: addForm.categories.split(',').map(c => c.trim()).filter(Boolean),
            });
            toast.success('Product added!');
            setShowAddModal(false);
            setAddForm({ name: '', price: '', image: '', description: '', manufacturer: '', usage: '', categories: '' });
            fetchProducts();
        } catch (err) {
            toast.error('Failed to add product');
        } finally {
            setAddLoading(false);
        }
    }, [addForm, fetchProducts]);

    // Memoized product rows for better performance
    const productRows = useMemo(() => {
        if (loading) {
            return Array.from({ length: 5 }, (_, index) => <ProductSkeleton key={index} />);
        }
        
        if (products.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                        No products found.
                    </td>
                </tr>
            );
        }
        
        return products.map(product => (
            <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-6 py-2 sm:py-4">
                    <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded bg-gray-100"
                        loading="lazy"
                    />
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4 font-semibold text-gray-800">
                    {product.name}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4">
                    ₹{product.price}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4">
                    {product.manufacturer || '-'}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4">
                    {Array.isArray(product.categories) && product.categories.length > 0 
                        ? product.categories.join(', ') 
                        : '-'}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4">
                    {product.usage || '-'}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center flex gap-2 justify-center">
                    <button 
                        onClick={() => handleEditClick(product)} 
                        className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
                    >
                        <FiEdit />
                    </button>
                    <button 
                        onClick={() => handleDelete(product._id)} 
                        className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-700"
                    >
                        <FiTrash2 />
                    </button>
                </td>
            </tr>
        ));
    }, [products, loading, handleEditClick, handleDelete]);

    return (
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Product Management</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow text-sm sm:text-base"
                    >
                        <FiPlus /> Add Product
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productRows}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <form onSubmit={handleAddProduct} className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-md relative">
                        <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiX size={24} /></button>
                        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Add Product</h2>
                        <div className="space-y-3 sm:space-y-4">
                            <input name="name" value={addForm.name} onChange={handleAddChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Medicine Name" required />
                            <input name="price" value={addForm.price} onChange={handleAddChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Price" type="number" required />
                            <div className="flex items-center gap-2 sm:gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-blue-50 px-2 sm:px-3 py-2 rounded border border-blue-200 hover:bg-blue-100 text-xs sm:text-base">
                                    <FiUpload />
                                    <span>Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                {addForm.image && (
                                    <img src={getImageUrl(addForm.image)} alt="Preview" className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded bg-gray-100 border" />
                                )}
                            </div>
                            <textarea name="description" value={addForm.description} onChange={handleAddChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Description" rows={2} />
                            <input name="manufacturer" value={addForm.manufacturer} onChange={handleAddChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Manufacturer" />
                            <textarea name="usage" value={addForm.usage} onChange={handleAddChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="How to take this medicine" rows={2} />
                            <input name="categories" value={addForm.categories} onChange={handleAddChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Categories (comma separated)" />
                        </div>
                        <button type="submit" disabled={addLoading} className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 text-xs sm:text-base"><FiSave /> {addLoading ? 'Adding...' : 'Add Product'}</button>
                    </form>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 w-full max-w-md relative">
                        <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiX size={24} /></button>
                        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Edit Product</h2>
                        <div className="space-y-3 sm:space-y-4">
                            <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Name" />
                            <input name="price" value={editForm.price} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Price" type="number" />
                            <input name="categories" value={editForm.categories || ''} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Categories (comma separated)" />
                            <input name="image" value={editForm.image} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Image URL" />
                            <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Description" rows={2} />
                            <input name="manufacturer" value={editForm.manufacturer} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Manufacturer" />
                            <textarea name="usage" value={editForm.usage} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="How to take this medicine" rows={2} />
                        </div>
                        <button onClick={handleEditSave} className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-xs sm:text-base"><FiSave /> Save Changes</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products; 