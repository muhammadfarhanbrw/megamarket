// // app/(components)/dashboard/components/ProductsTab.js
// 'use client';

// import { useState } from 'react';
// import { PencilIcon, TrashIcon, EyeIcon, ShareIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
// import ProductFormModal from './ProductFormModal';
// import DeleteModal from './DeleteModal';
// import ShareProductModal from './ShareProductModal';

// export default function ProductsTab({ products, fetchProducts }) {
//   const [showForm, setShowForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [productToDelete, setProductToDelete] = useState(null);
//   const [productToShare, setProductToShare] = useState(null);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   // Get unique categories
//   const uniqueCategories = [...new Set(products.map(p => p.categories).filter(Boolean))];
  
//   // Filter products
//   const filteredProducts = products.filter(p => {
//     const matchCategory = selectedCategory === 'all' || p.categories === selectedCategory;
//     const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   // Calculate stats
//   const totalProducts = products.length;
//   const totalSellingValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
//   const totalFactoryCost = products.reduce((sum, p) => sum + (p.factoryPrice || 0), 0);
//   const totalProfit = totalSellingValue - totalFactoryCost;
//   const avgProfitMargin = totalFactoryCost > 0 ? (totalProfit / totalFactoryCost * 100).toFixed(1) : 0;

//   // Calculate profit for a product
//   const getProductProfit = (product) => {
//     const profit = (product.price || 0) - (product.factoryPrice || 0);
//     const margin = product.factoryPrice ? (profit / product.factoryPrice * 100).toFixed(1) : 0;
//     return { profit, margin };
//   };

//   return (
//     <div>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <p className="text-gray-500 text-sm">Total Products</p>
//           <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-blue-50 to-blue-100">
//           <p className="text-gray-500 text-sm">Total Selling Value</p>
//           <p className="text-2xl font-bold text-blue-600">₹{totalSellingValue.toLocaleString()}</p>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-orange-50 to-orange-100">
//           <p className="text-gray-500 text-sm">Total Factory Cost</p>
//           <p className="text-2xl font-bold text-orange-600">₹{totalFactoryCost.toLocaleString()}</p>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-green-50 to-green-100">
//           <p className="text-gray-500 text-sm">Total Profit</p>
//           <p className="text-2xl font-bold text-green-600">₹{totalProfit.toLocaleString()}</p>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-purple-50 to-purple-100">
//           <p className="text-gray-500 text-sm">Avg Profit Margin</p>
//           <p className="text-2xl font-bold text-purple-600">{avgProfitMargin}%</p>
//         </div>
//       </div>

//       {/* Search and Filter */}
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//         <div className="flex flex-wrap gap-4 items-center">
//           <div className="flex-1 relative">
//             <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <input 
//               type="text" 
//               placeholder="Search products by name or description..." 
//               value={searchTerm} 
//               onChange={(e) => setSearchTerm(e.target.value)} 
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
//             />
//           </div>
//           <div className="relative">
//             <FunnelIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//             <select 
//               value={selectedCategory} 
//               onChange={(e) => setSelectedCategory(e.target.value)} 
//               className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//             >
//               <option value="all">All Categories</option>
//               {uniqueCategories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//           <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
//             Showing {filteredProducts.length} of {products.length} products
//           </div>
//           <button 
//             onClick={() => { setEditingProduct(null); setShowForm(true); }} 
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
//           >
//             <PlusIcon className="h-5 w-5" /> Add Product
//           </button>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factory Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.map(product => {
//                 const { profit, margin } = getProductProfit(product);
//                 return (
//                   <tr key={product._id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         {product.image && product.image !== 'pending' ? (
//                           <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded mr-3" />
//                         ) : (
//                           <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
//                             <span className="text-xs text-gray-400">No img</span>
//                           </div>
//                         )}
//                         <div>
//                           <p className="font-medium text-gray-900">{product.name}</p>
//                           <p className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 font-mono text-sm text-gray-600">{product.sellerId}</td>
//                     <td className="px-6 py-4">
//                       <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
//                         {product.categories}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-orange-600 font-medium">
//                       ₹{product.factoryPrice?.toLocaleString() || 0}
//                     </td>
//                     <td className="px-6 py-4 text-blue-600 font-bold">
//                       ₹{product.price?.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         ₹{profit.toLocaleString()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         margin > 50 ? 'bg-green-100 text-green-800' :
//                         margin > 20 ? 'bg-blue-100 text-blue-800' :
//                         margin > 0 ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {margin}%
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right space-x-2">
//                       <button 
//                         onClick={() => window.open(`/product/${product._id}`, '_blank')} 
//                         className="text-green-600 hover:text-green-800 transition"
//                         title="View Product"
//                       >
//                         <EyeIcon className="h-5 w-5" />
//                       </button>
//                       <button 
//                         onClick={() => setEditingProduct(product)} 
//                         className="text-blue-600 hover:text-blue-800 transition"
//                         title="Edit Product"
//                       >
//                         <PencilIcon className="h-5 w-5" />
//                       </button>
//                       <button 
//                         onClick={() => {
//                           setProductToShare(product);
//                           setShowShareModal(true);
//                         }} 
//                         className="text-purple-600 hover:text-purple-800 transition"
//                         title="Share with Users"
//                       >
//                         <ShareIcon className="h-5 w-5" />
//                       </button>
//                       <button 
//                         onClick={() => setProductToDelete(product)} 
//                         className="text-red-600 hover:text-red-800 transition"
//                         title="Delete Product"
//                       >
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       {showForm && (
//         <ProductFormModal 
//           product={editingProduct} 
//           onClose={() => setShowForm(false)} 
//           onSuccess={fetchProducts}
//           existingCategories={uniqueCategories}
//         />
//       )}
      
//       {productToDelete && (
//         <DeleteModal 
//           title="Delete Product" 
//           message={`Are you sure you want to delete "${productToDelete.name}"?`} 
//           onConfirm={async () => {
//             const res = await fetch(`/api/products/${productToDelete._id}`, { method: 'DELETE' });
//             if (res.ok) {
//               await fetchProducts();
//               alert('Product deleted successfully');
//             }
//             setProductToDelete(null);
//           }} 
//           onCancel={() => setProductToDelete(null)} 
//         />
//       )}

//       {showShareModal && (
//         <ShareProductModal 
//           product={productToShare}
//           onClose={() => {
//             setShowShareModal(false);
//             setProductToShare(null);
//           }}
//           onSuccess={() => {
//             setShowShareModal(false);
//             setProductToShare(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// app/(components)/dashboard/components/ProductsTab.js
'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, ShareIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductFormModal from './ProductFormModal';
import DeleteModal from './DeleteModal';
import ShareProductModal from './ShareProductModal';

export default function ProductsTab({ products, fetchProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToShare, setProductToShare] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const uniqueCategories = [...new Set(products.map(p => p.categories).filter(Boolean))];
  
  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.categories === selectedCategory;
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate stats
  const totalProducts = products.length;
  const totalSellingValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalFactoryCost = products.reduce((sum, p) => sum + (p.factoryPrice || 0), 0);
  const totalProfit = totalSellingValue - totalFactoryCost;
  const avgProfitMargin = totalFactoryCost > 0 ? (totalProfit / totalFactoryCost * 100).toFixed(1) : 0;

  // Calculate profit for a product
  const getProductProfit = (product) => {
    const profit = (product.price || 0) - (product.factoryPrice || 0);
    const margin = product.factoryPrice ? (profit / product.factoryPrice * 100).toFixed(1) : 0;
    return { profit, margin };
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle view button click - opens product in same tab or new tab
  const handleView = (productId) => {
    // Option 1: Open in same tab
    window.location.href = `/product/${productId}`;
    
    // Option 2: Open in new tab (uncomment if preferred)
    // window.open(`/product/${productId}`, '_blank');
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-blue-50 to-blue-100">
          <p className="text-gray-500 text-sm">Total Selling Value</p>
          <p className="text-2xl font-bold text-blue-600">₹{totalSellingValue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-orange-50 to-orange-100">
          <p className="text-gray-500 text-sm">Total Factory Cost</p>
          <p className="text-2xl font-bold text-orange-600">₹{totalFactoryCost.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-green-50 to-green-100">
          <p className="text-gray-500 text-sm">Total Profit</p>
          <p className="text-2xl font-bold text-green-600">₹{totalProfit.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-purple-50 to-purple-100">
          <p className="text-gray-500 text-sm">Avg Profit Margin</p>
          <p className="text-2xl font-bold text-purple-600">{avgProfitMargin}%</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products by name or description..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <button 
            onClick={() => { setEditingProduct(null); setShowForm(true); }} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5" /> Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factory Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const { profit, margin } = getProductProfit(product);
                return (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.image && product.image !== 'pending' ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-10 w-10 object-cover rounded mr-3" 
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{product.sellerId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {product.categories}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-orange-600 font-medium">
                      ₹{product.factoryPrice?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-bold">
                      ₹{product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{profit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        margin > 50 ? 'bg-green-100 text-green-800' :
                        margin > 20 ? 'bg-blue-100 text-blue-800' :
                        margin > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleView(product._id)} 
                        className="text-green-600 hover:text-green-800 transition"
                        title="View Product"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit Product"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setProductToShare(product);
                          setShowShareModal(true);
                        }} 
                        className="text-purple-600 hover:text-purple-800 transition"
                        title="Share with Users"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => setProductToDelete(product)} 
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Product"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }} 
          onSuccess={() => {
            fetchProducts();
            setShowForm(false);
            setEditingProduct(null);
          }}
          existingCategories={uniqueCategories}
        />
      )}
      
      {productToDelete && (
        <DeleteModal 
          title="Delete Product" 
          message={`Are you sure you want to delete "${productToDelete.name}"?`} 
          onConfirm={async () => {
            try {
              const res = await fetch(`/api/products/${productToDelete._id}`, { method: 'DELETE' });
              if (res.ok) {
                await fetchProducts();
                alert('Product deleted successfully');
              } else {
                const error = await res.json();
                alert(error.message || 'Failed to delete product');
              }
            } catch (error) {
              console.error('Error deleting product:', error);
              alert('Error deleting product');
            }
            setProductToDelete(null);
          }} 
          onCancel={() => setProductToDelete(null)} 
        />
      )}

      {showShareModal && (
        <ShareProductModal 
          product={productToShare}
          onClose={() => {
            setShowShareModal(false);
            setProductToShare(null);
          }}
          onSuccess={() => {
            setShowShareModal(false);
            setProductToShare(null);
          }}
        />
      )}
    </div>
  );
}