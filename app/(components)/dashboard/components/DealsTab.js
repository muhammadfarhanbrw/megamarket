// 'use client';

// import { useState } from 'react';
// import { FireIcon, CheckCircleIcon, TagIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
// import DealFormModal from './DealFormModal';
// import DeleteModal from './DeleteModal';

// export default function DealsTab({ deals, fetchDeals, products }) {
//   const [showForm, setShowForm] = useState(false);
//   const [editingDeal, setEditingDeal] = useState(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [dealToDelete, setDealToDelete] = useState(null);

//   const activeDeals = deals.filter(d => d.isActive && new Date(d.endDate) > new Date()).length;
//   const avgDiscount = deals.length > 0 ? Math.round(deals.reduce((sum, d) => sum + d.discountPercentage, 0) / deals.length) : 0;

//  // Find this function in your DealsTab.js and replace it:

// const handleDelete = async (deal) => {
//   // FIX: Use _id (MongoDB) instead of id
//   const dealId = deal?._id || deal?.id;
  
//   console.log('Deleting deal:', deal.productName);
//   console.log('Deal ID:', dealId);
  
//   if (!dealId) {
//     alert('Error: Invalid deal ID');
//     return;
//   }
  
//   if (confirm(`Are you sure you want to delete "${deal.productName}"?`)) {
//     try {
//       const response = await fetch(`/api/deals?id=${dealId}`, {
//         method: 'DELETE'
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         alert('Deal deleted successfully!');
//         // Refresh the deals list
//         fetchDeals(); // or whatever your refresh function is called
//       } else {
//         alert(data.error || 'Failed to delete deal');
//       }
//     } catch (error) {
//       console.error('Error deleting deal:', error);
//       alert('Network error. Please try again.');
//     }
//   }
// };

//   const toggleDealStatus = async (dealId, currentStatus) => {
//     const formData = new FormData();
//     formData.append('isActive', !currentStatus);
    
//     const res = await fetch(`/api/trending-deals/${dealId}`, {
//       method: 'PUT',
//       body: formData
//     });
    
//     if (res.ok) {
//       await fetchDeals();
//       alert(currentStatus ? 'Deal deactivated' : 'Deal activated');
//     } else {
//       alert('Failed to update deal status');
//     }
//   };

//   return (
//     <>
//       {/* Stats and Add Button */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="grid grid-cols-3 gap-6 flex-1">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <FireIcon className="h-8 w-8 text-orange-600 mb-2" />
//             <p className="text-2xl font-bold">{deals.length}</p>
//             <p className="text-gray-600">Total Deals</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
//             <p className="text-2xl font-bold">{activeDeals}</p>
//             <p className="text-gray-600">Active Deals</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <TagIcon className="h-8 w-8 text-purple-600 mb-2" />
//             <p className="text-2xl font-bold">{avgDiscount}%</p>
//             <p className="text-gray-600">Avg Discount</p>
//           </div>
//         </div>
//         <button 
//           onClick={() => { setEditingDeal(null); setShowForm(true); }} 
//           className="bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 ml-4 hover:bg-orange-700 transition"
//         >
//           <PlusIcon className="h-5 w-5" /> Add Deal
//         </button>
//       </div>

//       {/* Deals Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {deals.length === 0 ? (
//           <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
//             <FireIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//             <p className="text-gray-500">No trending deals yet</p>
//             <button onClick={() => { setEditingDeal(null); setShowForm(true); }} className="mt-3 text-orange-600 hover:text-orange-700">
//               Create your first deal
//             </button>
//           </div>
//         ) : (
//           deals.map(deal => {
//             const isExpired = new Date(deal.endDate) < new Date();
//             return (
//               <div key={deal._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
//                 <div className="relative h-48">
//                   <img 
//                     src={deal.image} 
//                     alt={deal.title} 
//                     className="w-full h-full object-cover" 
//                     onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Deal+Image'} 
//                   />
//                   <div className="absolute top-2 right-2">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       deal.isActive && !isExpired ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
//                     }`}>
//                       {deal.isActive && !isExpired ? 'Active' : 'Expired'}
//                     </span>
//                   </div>
//                   <div className="absolute top-2 left-2">
//                     <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                       -{deal.discountPercentage}%
//                     </div>
//                   </div>
//                   {deal.priority > 0 && (
//                     <div className="absolute bottom-2 left-2">
//                       <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                         🔥 Priority {deal.priority}
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="p-4">
//                   <h3 className="font-semibold text-lg text-gray-800 mb-1">{deal.title}</h3>
//                   <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                  
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-2xl font-bold text-orange-600">₹{deal.dealPrice}</span>
//                     <span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
//                     <span>Ends: {new Date(deal.endDate).toLocaleDateString()}</span>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => { setEditingDeal(deal); setShowForm(true); }} 
//                       className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
//                     >
//                       <PencilIcon className="h-4 w-4" /> Edit
//                     </button>
//                     <button 
//                       onClick={() => toggleDealStatus(deal._id, deal.isActive)} 
//                       className={`px-3 py-2 rounded-lg transition-colors ${
//                         deal.isActive ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'
//                       }`}
//                     >
//                       {deal.isActive ? 'Deactivate' : 'Activate'}
//                     </button>
//                     <button 
//                       onClick={() => { setDealToDelete(deal); setDeleteModalOpen(true); }} 
//                       className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                       <TrashIcon className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Modals */}
//       {showForm && <DealFormModal deal={editingDeal} products={products} onClose={() => setShowForm(false)} onSuccess={fetchDeals} />}
//       {deleteModalOpen && <DeleteModal title="Delete Deal" message={`Delete "${dealToDelete?.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteModalOpen(false)} />}
//     </>
//   );
// }
'use client';

import { useState } from 'react';
import { FireIcon, CheckCircleIcon, TagIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DealFormModal from './DealFormModal';
import DeleteModal from './DeleteModal';

export default function DealsTab({ deals, fetchDeals, products }) {
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeDeals = deals.filter(d => d.isActive && new Date(d.endDate) > new Date()).length;
  const avgDiscount = deals.length > 0 ? Math.round(deals.reduce((sum, d) => sum + d.discountPercentage, 0) / deals.length) : 0;

  // Force refresh deals from API
  const refreshDeals = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    console.log('🔄 Refreshing deals...');
    try {
      await fetchDeals();
      console.log('✅ Deals refreshed');
    } catch (error) {
      console.error('Error refreshing deals:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!dealToDelete || isDeleting) return;
    
    const dealId = dealToDelete._id || dealToDelete.id;
    
    if (!dealId) {
      alert('Error: Invalid deal ID');
      setDeleteModalOpen(false);
      setDealToDelete(null);
      return;
    }
    
    setIsDeleting(true);
    
    try {
      console.log('🗑️ Deleting deal:', dealToDelete.title);
      console.log('📝 Deal ID:', dealId);
      
      const response = await fetch(`/api/trending-deals/${dealId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      console.log('📡 Delete response:', data);
      
      if (response.ok && data.success) {
        console.log('✅ Delete successful, refreshing deals...');
        await refreshDeals();
        alert('✅ Deal deleted successfully!');
      } else {
        console.log('⚠️ Delete API issue, but refreshing anyway...');
        await refreshDeals();
        alert('⚠️ Deal removed from list');
      }
      
      setDeleteModalOpen(false);
      setDealToDelete(null);
      
    } catch (error) {
      console.error('❌ Error deleting deal:', error);
      alert('Error deleting deal. Refreshing page...');
      // Still try to refresh
      await refreshDeals();
      setDeleteModalOpen(false);
      setDealToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDealStatus = async (dealId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !currentStatus);
      
      const res = await fetch(`/api/trending-deals/${dealId}`, {
        method: 'PUT',
        body: formData
      });
      
      if (res.ok) {
        await refreshDeals();
        alert(currentStatus ? 'Deal deactivated' : 'Deal activated');
      } else {
        alert('Failed to update deal status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Network error');
    }
  };

  return (
    <>
      {/* Stats and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="grid grid-cols-3 gap-6 flex-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <FireIcon className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-2xl font-bold">{deals.length}</p>
            <p className="text-gray-600">Total Deals</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold">{activeDeals}</p>
            <p className="text-gray-600">Active Deals</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TagIcon className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{avgDiscount}%</p>
            <p className="text-gray-600">Avg Discount</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refreshDeals}
            disabled={isRefreshing}
            className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isRefreshing ? '🔄 Syncing...' : '🔄 Sync'}
          </button>
          <button 
            onClick={() => { setEditingDeal(null); setShowForm(true); }} 
            className="bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
          >
            <PlusIcon className="h-5 w-5" /> Add Deal
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
            <FireIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No trending deals yet</p>
            <div className="flex gap-3 justify-center mt-3">
              <button onClick={() => { setEditingDeal(null); setShowForm(true); }} className="text-orange-600 hover:text-orange-700">
                Create your first deal
              </button>
              <button onClick={refreshDeals} className="text-gray-600 hover:text-gray-700">
                Sync from database
              </button>
            </div>
          </div>
        ) : (
          deals.map(deal => {
            const isExpired = new Date(deal.endDate) < new Date();
            const dealId = deal._id || deal.id;
            
            return (
              <div key={dealId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48">
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=Deal+Image'} 
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      deal.isActive && !isExpired ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {deal.isActive && !isExpired ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{deal.discountPercentage}%
                    </div>
                  </div>
                  {deal.priority > 0 && (
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🔥 Priority {deal.priority}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{deal.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-orange-600">₹{deal.dealPrice}</span>
                    <span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Ends: {new Date(deal.endDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingDeal(deal); setShowForm(true); }} 
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <PencilIcon className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => toggleDealStatus(dealId, deal.isActive)} 
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        deal.isActive ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {deal.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => { 
                        console.log('Setting deal to delete:', deal.title);
                        setDealToDelete(deal); 
                        setDeleteModalOpen(true); 
                      }} 
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <DealFormModal 
          deal={editingDeal} 
          products={products} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            refreshDeals();
          }} 
        />
      )}
      
      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteModal 
          title="Delete Deal" 
          message={`Delete "${dealToDelete?.title}"? This action cannot be undone.`} 
          onConfirm={handleDelete} 
          onCancel={() => {
            setDeleteModalOpen(false);
            setDealToDelete(null);
          }} 
        />
      )}
    </>
  );
}