// app/(components)/dashboard/components/FactoryRatesTab.js
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function FactoryRatesTab() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    factoryPrice: '',
    sellingPrice: '',
    minOrderQuantity: 1,
    supplier: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
    let num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '₹0';
    const rounded = Math.round(num);
    return `₹${rounded.toLocaleString('en-IN')}`;
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setError(null);
      const response = await fetch('/api/factory-rates');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      if (data.success) {
        setRates(data.rates || []);
        
        const ratesWithImages = data.rates.filter(r => r.imageUrl && r.imageUrl.trim() !== '');
        const ratesWithoutImages = data.rates.filter(r => !r.imageUrl || r.imageUrl.trim() === '');
        
        console.log(`📊 Total rates: ${data.rates.length}`);
        console.log(`✅ Rates with images: ${ratesWithImages.length}`);
        console.log(`❌ Rates without images: ${ratesWithoutImages.length}`);
        
        const uniqueCategories = [...new Set((data.rates || []).map(rate => rate.category))];
        setCategories(uniqueCategories);
      } else {
        setError(data.error || 'Failed to fetch rates');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // FORCE SYNC - This will directly copy images from products to factory rates
  const forceSyncImages = async () => {
    setSyncing(true);
    try {
      console.log('🔄 Starting force sync...');
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      
      if (productsData.success && productsData.products) {
        let updatedCount = 0;
        let createdCount = 0;
        let productsWithImages = 0;
        let errors = 0;
        
        for (const product of productsData.products) {
          if (product.factoryPrice && product.factoryPrice > 0) {
            let imageUrl = '';
            if (product.image && product.image !== 'pending') {
              imageUrl = product.image;
              productsWithImages++;
            }
            
            console.log(`📦 Product: ${product.name} - Image: ${imageUrl || 'NO IMAGE'}`);
            
            const ratesRes = await fetch('/api/factory-rates');
            const ratesData = await ratesRes.json();
            const existingRate = ratesData.rates?.find(r => r.productName === product.name);
            
            const rateData = {
              productName: product.name,
              category: product.categories || 'Uncategorized',
              factoryPrice: product.factoryPrice,
              sellingPrice: product.price,
              minOrderQuantity: 1,
              supplier: product.sellerId || 'Admin',
              imageUrl: imageUrl
            };
            
            try {
              if (existingRate && existingRate._id) {
                const res = await fetch(`/api/factory-rates?id=${existingRate._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(rateData)
                });
                if (res.ok) {
                  updatedCount++;
                  console.log(`✅ Updated: ${product.name}`);
                } else {
                  errors++;
                }
              } else {
                const res = await fetch('/api/factory-rates', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(rateData)
                });
                if (res.ok) {
                  createdCount++;
                  console.log(`✅ Created: ${product.name}`);
                } else {
                  errors++;
                }
              }
            } catch (err) {
              console.error(`❌ Error processing ${product.name}:`, err);
              errors++;
            }
          }
        }
        
        alert(`✅ Force Sync Complete!\n\n📝 Updated: ${updatedCount}\n✨ Created: ${createdCount}\n🖼️ Products with images: ${productsWithImages}\n⚠️ Errors: ${errors}\n\nRefresh the page to see images!`);
        await fetchRates();
      }
    } catch (error) {
      console.error('Force sync error:', error);
      alert('Error during force sync: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  // Debug function to check database
  const debugDatabase = async () => {
    console.log('===== DATABASE DEBUG =====');
    const res = await fetch('/api/factory-rates');
    const data = await res.json();
    
    if (data.success && data.rates) {
      console.log(`Total rates: ${data.rates.length}`);
      data.rates.forEach((rate, i) => {
        console.log(`\n[${i + 1}] ${rate.productName}`);
        console.log(`    _id: ${rate._id}`);
        console.log(`    id: ${rate.id}`);
        console.log(`    imageUrl: "${rate.imageUrl}"`);
      });
    }
    console.log('===== END DEBUG =====');
  };

  const syncFromProducts = async () => {
    setSyncing(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success && data.products) {
        let syncedCount = 0;
        let updatedCount = 0;
        let errors = 0;
        
        for (const product of data.products) {
          if (product.factoryPrice && product.factoryPrice > 0) {
            const ratesRes = await fetch('/api/factory-rates');
            const ratesData = await ratesRes.json();
            const existingRate = ratesData.rates?.find(r => r.productName === product.name);
            
            let imageUrl = '';
            if (product.image && product.image !== 'pending') {
              imageUrl = product.image;
            }
            
            const rateData = {
              productName: product.name,
              category: product.categories || 'Uncategorized',
              factoryPrice: product.factoryPrice,
              sellingPrice: product.price,
              minOrderQuantity: 1,
              supplier: product.sellerId || 'Admin',
              imageUrl: imageUrl
            };
            
            try {
              if (existingRate && existingRate._id) {
                const updateResponse = await fetch(`/api/factory-rates?id=${existingRate._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(rateData)
                });
                if (updateResponse.ok) updatedCount++;
                else errors++;
              } else {
                const createResponse = await fetch('/api/factory-rates', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(rateData)
                });
                if (createResponse.ok) syncedCount++;
                else errors++;
              }
            } catch (err) {
              console.error(`Error syncing ${product.name}:`, err);
              errors++;
            }
          }
        }
        
        alert(`Sync completed!\n\nNew rates added: ${syncedCount}\nExisting rates updated: ${updatedCount}\nErrors: ${errors}`);
        await fetchRates();
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      setError('Error syncing products. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingRate 
      ? `/api/factory-rates?id=${editingRate._id || editingRate.id}`
      : '/api/factory-rates';
    
    const method = editingRate ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          factoryPrice: parseFloat(formData.factoryPrice),
          sellingPrice: parseFloat(formData.sellingPrice),
          minOrderQuantity: parseInt(formData.minOrderQuantity)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(editingRate ? 'Rate updated successfully!' : 'Rate created successfully!');
        setShowModal(false);
        setEditingRate(null);
        setFormData({
          productName: '',
          category: '',
          factoryPrice: '',
          sellingPrice: '',
          minOrderQuantity: 1,
          supplier: '',
          imageUrl: ''
        });
        setImagePreview('');
        fetchRates();
      } else {
        alert(data.error || 'Failed to save rate');
      }
    } catch (error) {
      console.error('Error saving rate:', error);
      alert('Network error');
    }
  };

  // FIXED: Delete handler with better ID handling
  const handleDelete = async (rate) => {
    // Get the ID from either _id or id property
    const id = rate?._id || rate?.id;
    
    console.log('Delete called with rate object:', rate);
    console.log('Extracted ID:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid ID for deletion:', id);
      alert('Error: Invalid product ID. Please refresh the page and try again.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${rate.productName}"?`)) {
      try {
        const response = await fetch(`/api/factory-rates?id=${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('Rate deleted successfully!');
          fetchRates();
        } else {
          alert(data.error || 'Failed to delete rate');
        }
      } catch (error) {
        console.error('Error deleting rate:', error);
        alert('Network error');
      }
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      productName: rate.productName || '',
      category: rate.category || '',
      factoryPrice: rate.factoryPrice || '',
      sellingPrice: rate.sellingPrice || '',
      minOrderQuantity: rate.minOrderQuantity || 1,
      supplier: rate.supplier || '',
      imageUrl: rate.imageUrl || ''
    });
    setImagePreview(rate.imageUrl || '');
    setShowModal(true);
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({...formData, imageUrl: url});
    setImagePreview(url);
  };

  // FIX BROKEN IMAGES FUNCTION
  const fixBrokenImages = async () => {
    const res = await fetch('/api/factory-rates');
    const data = await res.json();
    
    if (data.success && data.rates) {
      let fixed = 0;
      for (const rate of data.rates) {
        if (rate.imageUrl && rate.imageUrl.includes('/images/')) {
          console.log(`Removing broken image for: ${rate.productName}`);
          const id = rate._id || rate.id;
          if (id) {
            await fetch(`/api/factory-rates?id=${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...rate,
                imageUrl: ''
              })
            });
            fixed++;
          }
        }
      }
      alert(`✅ Removed ${fixed} broken image links! Refresh the page.`);
      window.location.reload();
    }
  };

  // CHECK IDS FUNCTION
  const checkIds = async () => {
    const res = await fetch('/api/factory-rates');
    const data = await res.json();
    
    if (data.success && data.rates) {
      console.log('=== RATES DATA ===');
      data.rates.forEach((rate, i) => {
        console.log(`${i+1}. Product: ${rate.productName}`);
        console.log(`   _id: ${rate._id}`);
        console.log(`   id: ${rate.id}`);
        console.log(`   Has _id: ${!!rate._id}`);
        console.log(`   Has id: ${!!rate.id}`);
        console.log(`   Image URL: ${rate.imageUrl || 'none'}`);
      });
      alert(`✅ Check console (F12) for ID information`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchRates}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Factory Rates</h2>
          <p className="text-gray-600">Manage product pricing from factories</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={debugDatabase}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            🐛 Debug DB
          </button>
          <button
            onClick={checkIds}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            🔍 Check IDs
          </button>
          <button
            onClick={fixBrokenImages}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            🗑️ Fix Broken Images
          </button>
          <button
            onClick={forceSyncImages}
            disabled={syncing}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Force Sync Images'}
          </button>
          <button
            onClick={syncFromProducts}
            disabled={syncing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync from Products'}
          </button>
          <button
            onClick={() => {
              setEditingRate(null);
              setFormData({
                productName: '',
                category: '',
                factoryPrice: '',
                sellingPrice: '',
                minOrderQuantity: 1,
                supplier: '',
                imageUrl: ''
              });
              setImagePreview('');
              setShowModal(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Rate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm">Total Products</p>
          <p className="text-2xl font-bold">{rates.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm">Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm">Avg Factory Price</p>
          <p className="text-2xl font-bold">
            {formatPrice(rates.reduce((sum, r) => sum + (r.factoryPrice || 0), 0) / (rates.length || 1))}
          </p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <p className="text-sm">Avg Selling Price</p>
          <p className="text-2xl font-bold">
            {formatPrice(rates.reduce((sum, r) => sum + (r.sellingPrice || 0), 0) / (rates.length || 1))}
          </p>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factory Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rates.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    No factory rates found. Click &quot;Sync from Products&quot; to import from products, or &quot;Add Rate&quot; to create one manually.
                  </td>
                </tr>
              ) : (
                rates.map((rate, index) => {
                  const profitMargin = rate.factoryPrice > 0 
                    ? ((rate.sellingPrice - rate.factoryPrice) / rate.factoryPrice * 100).toFixed(1)
                    : '0';
                  
                  const rateId = rate._id || rate.id || index;
                  const hasValidImage = rate.imageUrl && rate.imageUrl.trim() !== '' && !rate.imageUrl.includes('product_1778061867570');
                  
                  return (
                    <tr key={rateId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {hasValidImage ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={rate.imageUrl}
                              alt={rate.productName || 'Product image'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{rate.productName || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{rate.category || 'Uncategorized'}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatPrice(rate.factoryPrice)}</td>
                      <td className="px-6 py-4 text-gray-600">{formatPrice(rate.sellingPrice)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          profitMargin > 50 ? 'bg-green-100 text-green-800' :
                          profitMargin > 20 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profitMargin}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{rate.minOrderQuantity || 1}</td>
                      <td className="px-6 py-4 text-gray-600">{rate.supplier || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rate)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {editingRate ? 'Edit Factory Rate' : 'Add Factory Rate'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="e.g., Electronics, Clothing, Furniture"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setImagePreview('');
                              alert('Invalid image URL. Please provide a valid image URL.');
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Image preview</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Factory Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.factoryPrice}
                      onChange={(e) => setFormData({...formData, factoryPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      min="0"
                      step="0.01"
                    />
                    {formData.factoryPrice && formData.sellingPrice && (
                      <p className="text-xs mt-1">
                        Profit: {formatPrice(parseFloat(formData.sellingPrice) - parseFloat(formData.factoryPrice))} 
                        ({((parseFloat(formData.sellingPrice) - parseFloat(formData.factoryPrice)) / parseFloat(formData.factoryPrice) * 100).toFixed(1)}%)
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Order Quantity</label>
                    <input
                      type="number"
                      value={formData.minOrderQuantity}
                      onChange={(e) => setFormData({...formData, minOrderQuantity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Supplier (Optional)</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Supplier name"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                    >
                      {editingRate ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}