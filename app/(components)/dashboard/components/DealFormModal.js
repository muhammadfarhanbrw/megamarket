'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DealFormModal({ deal, products, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    originalPrice: '',
    dealPrice: '',
    endDate: '',
    productId: '',
    priority: '0',
    image: null
  });

  // Auto-calculate deal price when discount or original price changes
  useEffect(() => {
    if (formData.discountPercentage && formData.originalPrice) {
      const discount = (parseFloat(formData.originalPrice) * parseFloat(formData.discountPercentage)) / 100;
      const dealPrice = parseFloat(formData.originalPrice) - discount;
      setFormData(prev => ({ ...prev, dealPrice: dealPrice.toFixed(2) }));
    }
  }, [formData.discountPercentage, formData.originalPrice]);

  // Populate form when editing
  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        description: deal.description || '',
        discountPercentage: deal.discountPercentage || '',
        originalPrice: deal.originalPrice || '',
        dealPrice: deal.dealPrice || '',
        endDate: deal.endDate ? new Date(deal.endDate).toISOString().slice(0, 16) : '',
        productId: deal.productId?._id || deal.productId || '',
        priority: deal.priority?.toString() || '0',
        image: null
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate end date is in the future
    const endDateObj = new Date(formData.endDate);
    const now = new Date();
    if (endDateObj <= now) {
      alert('End date must be in the future');
      return;
    }
    
    if (!formData.title || !formData.description || !formData.discountPercentage || 
        !formData.originalPrice || !formData.dealPrice || !formData.endDate) {
      alert('Please fill all required fields');
      return;
    }
    
    // Validate image for new deals
    if (!deal && !formData.image) {
      alert('Please select an image for the deal');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });
      
      const url = deal ? `/api/trending-deals/${deal._id}` : '/api/trending-deals';
      const method = deal ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: submitFormData
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(deal ? 'Deal updated successfully!' : 'Deal created successfully!');
        onSuccess();
        onClose();
      } else {
        alert(data.error || 'Failed to save deal');
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Error saving deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{deal ? 'Edit Deal' : 'Create New Deal'}</h2>
            <p className="text-orange-100 text-sm mt-1">Create exciting offers for your customers</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Deal Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              placeholder="e.g., Summer Sale - 50% Off"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              placeholder="Describe the deal..."
            />
          </div>
          
          {/* Original Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount % *</label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                step="1"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
          
          {/* Deal Price (Auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Price *</label>
            <input
              type="number"
              name="dealPrice"
              value={formData.dealPrice}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Auto-calculated from original price and discount</p>
          </div>
          
          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time *</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          {/* Related Product (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related Product (Optional)</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">No related product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>
          </div>
          
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="0">Normal</option>
              <option value="1">High</option>
              <option value="2">Very High</option>
              <option value="3">Top Priority</option>
            </select>
          </div>
          
          {/* Deal Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Image {!deal && '*'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              required={!deal}
            />
            {deal && (
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold"
            >
              {loading ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}