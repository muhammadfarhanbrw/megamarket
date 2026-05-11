'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [sellerId, setSellerId] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([
        'Electronics',
        'Clothing', 
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Beauty',
        'Food'
    ]);
    const [showCustomInput, setShowCustomInput] = useState(false);

    // Fetch existing categories from database on page load
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/products');
            if (response.data.success && response.data.categories) {
                // Merge existing categories with default ones, remove duplicates
                const existingCategories = response.data.categories;
                const allCategories = [...new Set([...categoryOptions, ...existingCategories])];
                setCategoryOptions(allCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle dropdown change
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setShowCustomInput(true);
            setCategories('');
            setCustomCategory('');
        } else {
            setCategories(value);
            setShowCustomInput(false);
            setCustomCategory('');
        }
    };

    // Handle custom category input
    const handleCustomCategoryChange = (e) => {
        const value = e.target.value;
        setCustomCategory(value);
        setCategories(value);
    };

    // Add new category to the list
    const addNewCategory = () => {
        if (customCategory && !categoryOptions.includes(customCategory)) {
            setCategoryOptions([...categoryOptions, customCategory]);
            setShowCustomInput(false);
            alert(`Category "${customCategory}" added successfully!`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !sellerId || !description || !price || !categories) {
            alert('Please fill all required fields');
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('sellerId', sellerId);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('categories', categories);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            const response = await axios.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Product submitted:', response.data);
            
            // Reset form
            setName('');
            setSellerId('');
            setDescription('');
            setPrice('');
            setCategories('');
            setCustomCategory('');
            setShowCustomInput(false);
            setImageFile(null);
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.value = '';
            
            // Refresh categories after adding product
            await fetchCategories();
            
            alert('Product created successfully!');
            router.push('/');
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoBack = () => {
        router.push('/');
    };
    
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>Add New Product</h1>
                <button onClick={handleGoBack} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    ← Back
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Product Name *</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter product name"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        disabled={loading}
                        required
                    />
                </div>
                
                {/* Seller ID */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Seller ID *</label>
                    <input 
                        type="text" 
                        value={sellerId} 
                        onChange={(e) => setSellerId(e.target.value)} 
                        placeholder="Enter seller ID"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        disabled={loading}
                        required
                    />
                </div>
                
                {/* Description */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Description *</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Enter product description"
                        rows="4"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        disabled={loading}
                        required
                    />
                </div>
                
                {/* Price */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Price *</label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        placeholder="Enter price"
                        step="0.01"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        disabled={loading}
                        required
                    />
                </div>
                
                {/* Categories */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Category *</label>
                    {!showCustomInput ? (
                        <div>
                            <select
                                value={categories}
                                onChange={handleCategoryChange}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                disabled={loading}
                                required
                            >
                                <option value="">Select a category</option>
                                {categoryOptions.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="custom">+ Add New Category</option>
                            </select>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <input 
                                    type="text"
                                    value={customCategory}
                                    onChange={handleCustomCategoryChange}
                                    placeholder="Enter new category name"
                                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={addNewCategory}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCustomInput(false);
                                        setCustomCategory('');
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                New category will be saved and appear in dropdown for future products
                            </small>
                        </div>
                    )}
                </div>
                
                {/* Product Image */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Product Image (optional)</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        disabled={loading}
                    />
                </div>
                
                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            flex: 1, 
                            padding: '10px', 
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Product'}
                    </button>
                    <button 
                        type="button"
                        onClick={handleGoBack}
                        disabled={loading}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Page;