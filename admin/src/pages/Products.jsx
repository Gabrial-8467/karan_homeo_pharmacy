import { useEffect, useState, useRef } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api` });

// Helper to get correct image URL
const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
};

// Remove socket.io and stock update logic

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
    });
    const [addLoading, setAddLoading] = useState(false);
    const fileInputRef = useRef();

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    // Edit product
    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description || '',
            manufacturer: product.manufacturer || '',
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = async () => {
        try {
            await api.put(`/products/${editingProduct._id}`, editForm);
            toast.success('Product updated!');
            setShowEditModal(false);
            fetchProducts();
        } catch (err) {
            toast.error('Failed to update product');
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted!');
            fetchProducts();
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    // Add product
    const handleAddChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    // Image upload handler
    const handleImageUpload = async (e) => {
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
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            await api.post('/products', {
                ...addForm,
                price: Number(addForm.price),
            });
            toast.success('Product added!');
            setShowAddModal(false);
            setAddForm({ name: '', price: '', image: '', description: '', manufacturer: '' });
            fetchProducts();
        } catch (err) {
            toast.error('Failed to add product');
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Product Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow text-sm sm:text-base"
                >
                    <FiPlus /> Add Product
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-6">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-6 text-gray-400">No products found.</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-2 sm:px-6 py-2 sm:py-4"><img src={getImageUrl(product.image)} alt={product.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded bg-gray-100" /></td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 font-semibold text-gray-800">{product.name}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4">₹{product.price}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4">{product.description}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4">{product.manufacturer || '-'}</td>
                                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-center flex gap-2 justify-center">
                                        <button onClick={() => handleEditClick(product)} className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"><FiEdit /></button>
                                        <button onClick={() => handleDelete(product._id)} className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-700"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))
                        )}
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
                            <input name="image" value={editForm.image} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Image URL" />
                            <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Description" rows={2} />
                            <input name="manufacturer" value={editForm.manufacturer} onChange={handleEditChange} className="w-full p-2 sm:p-3 border rounded text-xs sm:text-base" placeholder="Manufacturer" />
                        </div>
                        <button onClick={handleEditSave} className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-xs sm:text-base"><FiSave /> Save Changes</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products; 