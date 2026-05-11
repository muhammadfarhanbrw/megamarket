// app/(components)/dashboard/components/ProductFormModal.js
'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductFormModal({ product, onClose, onSuccess, existingCategories = [] }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sellerId: product?.sellerId || '',
    description: product?.description || '',
    price: product?.price || '',
    factoryPrice: product?.factoryPrice || '',
    categories: product?.categories || '',
    image: null,
    source: 'admin'
  });
  const [imagePreview, setImagePreview] = useState(product?.image || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('sellerId', formData.sellerId);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('factoryPrice', formData.factoryPrice);
    formDataToSend.append('categories', formData.categories);
    formDataToSend.append('source', 'admin');
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    
    try {
      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, body: formDataToSend });
      const data = await res.json();
      
      if (data.success) {
        alert(product ? 'Product updated!' : 'Product created!');
        onSuccess();
        onClose();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Calculate profit preview
  const factoryPriceNum = parseFloat(formData.factoryPrice) || 0;
  const sellingPriceNum = parseFloat(formData.price) || 0;
  const profit = sellingPriceNum - factoryPriceNum;
  const profitMargin = factoryPriceNum > 0 ? (profit / factoryPriceNum * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Seller ID *</label>
              <input
                type="text"
                value={formData.sellerId}
                onChange={(e) => setFormData({...formData, sellerId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Factory Price (₹) *</label>
                <input
                  type="number"
                  value={formData.factoryPrice}
                  onChange={(e) => setFormData({...formData, factoryPrice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Cost price from factory</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Price shown to customers</p>
              </div>
            </div>
            
            {/* Profit Preview */}
            {(factoryPriceNum > 0 || sellingPriceNum > 0) && (
              <div className={`p-3 rounded-lg ${profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-sm ${profit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  <strong>Profit Preview:</strong> ₹{profit.toFixed(2)} 
                  ({profitMargin}% margin)
                </p>
                {profit < 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ Warning: Selling price is less than factory price!
                  </p>
                )}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <input
                type="text"
                value={formData.categories}
                onChange={(e) => setFormData({...formData, categories: e.target.value})}
                list="categories"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter or select category"
              />
              <datalist id="categories">
                {existingCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded border" />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}