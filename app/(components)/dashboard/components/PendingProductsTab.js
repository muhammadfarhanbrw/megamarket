// app/dashboard/components/PendingProductsTab.js
'use client';

import { useState } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function PendingProductsTab({ products, fetchProducts }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pendingProducts = products.filter(p => p.status === 'pending');
  const approvedProducts = products.filter(p => p.status === 'approved');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  const handleApprove = async (productId) => {
    if (!confirm('Approve this product? It will appear on the front page.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      
      if (response.ok) {
        await fetchProducts();
        alert('✅ Product approved and will appear on the front page!');
      } else {
        const error = await response.json();
        alert('❌ Failed to approve product: ' + error.error);
      }
    } catch (error) {
      console.error('Error approving product:', error);
      alert('❌ Failed to approve product');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (productId) => {
    if (!rejectionNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          adminNotes: rejectionNote 
        })
      });
      
      if (response.ok) {
        await fetchProducts();
        setShowRejectModal(false);
        setRejectionNote('');
        setSelectedProduct(null);
        alert('❌ Product rejected');
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('❌ Failed to reject product');
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ product, type }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex p-4">
        {product.image && product.image !== 'pending' ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-24 w-24 object-cover rounded-lg"
            onError={(e) => e.target.src = 'https://via.placeholder.com/96'}
          />
        ) : (
          <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">Seller: {product.sellerId}</p>
              <p className="text-sm text-gray-600 mt-1">{product.description?.substring(0, 100)}...</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Category:</span> {product.categories}
              </p>
              <p className="text-lg font-bold text-green-600 mt-1">₹{product.price?.toLocaleString()}</p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button 
                onClick={() => window.open(`/product/${product._id}`, '_blank')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="View Product"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              
              {type === 'pending' && (
                <>
                  <button 
                    onClick={() => handleApprove(product._id)}
                    disabled={loading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Approve Product"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowRejectModal(true);
                    }}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Reject Product"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {type === 'rejected' && product.adminNotes && (
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-2 hidden group-hover:block z-10 shadow-lg">
                    <div className="font-semibold mb-1">Rejection Reason:</div>
                    {product.adminNotes}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {type === 'pending' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⏳ Pending Approval
              </span>
            )}
            {type === 'approved' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Live on Front Page
              </span>
            )}
            {type === 'rejected' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ❌ Rejected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pending Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            {pendingProducts.length}
          </span>
          Pending Approval
        </h2>
        {pendingProducts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">✨ No products pending approval</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingProducts.map(product => (
              <ProductCard key={product._id} product={product} type="pending" />
            ))}
          </div>
        )}
      </div>

      {/* Approved Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {approvedProducts.length}
          </span>
          Live Products
        </h2>
        {approvedProducts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">No approved products yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {approvedProducts.slice(0, 5).map(product => (
              <ProductCard key={product._id} product={product} type="approved" />
            ))}
          </div>
        )}
      </div>

      {/* Rejected Products Section */}
      {rejectedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              {rejectedProducts.length}
            </span>
            Rejected Products
          </h2>
          <div className="grid gap-4">
            {rejectedProducts.map(product => (
              <ProductCard key={product._id} product={product} type="rejected" />
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Reject Product</h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for rejecting <strong className="text-gray-900">"{selectedProduct.name}"</strong>
            </p>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Reason for rejection (will be shown to seller)..."
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedProduct._id)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Reject Product'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNote('');
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}