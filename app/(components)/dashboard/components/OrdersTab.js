
'use client';

import { useState } from 'react';
import { DocumentTextIcon, ClockIcon, TruckIcon, CheckCircleIcon, CurrencyRupeeIcon, EyeIcon, TrashIcon, PhoneIcon, MapPinIcon, UserGroupIcon, GiftIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import DeleteModal from './DeleteModal';

export default function OrdersTab({ orders, fetchOrders }) {
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [activeStatus, setActiveStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [copySuccess, setCopySuccess] = useState(null);

  // Helper function to format numbers - removes decimals
  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
    let num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '₹0';
    // Round to nearest integer to fix floating point issues
    const rounded = Math.round(num);
    return `₹${rounded.toLocaleString('en-IN')}`;
  };

  // Calculate counts for each status
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
  // Seller specific stats
  const sellerOrders = orders.filter(o => o.source === 'seller_portal');
  const totalSellerOrders = sellerOrders.length;
  const totalCommission = sellerOrders.reduce((sum, o) => sum + (o.commission || 0), 0);
  const pendingCommission = sellerOrders.filter(o => o.commissionStatus === 'pending').reduce((sum, o) => sum + (o.commission || 0), 0);
  
  // Profit stats
  const totalFactoryCost = orders.reduce((sum, o) => sum + (o.totalFactoryCost || 0), 0);
  const totalProfit = totalRevenue - totalFactoryCost;
  const avgProfitMargin = totalFactoryCost > 0 ? (totalProfit / totalFactoryCost * 100).toFixed(1) : 0;

  // Filter orders based on active status and source
  const filteredOrders = orders.filter(order => {
    if (activeStatus !== 'all' && order.status !== activeStatus) return false;
    if (filterSource !== 'all' && order.source !== filterSource) return false;
    return true;
  });

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    setUpdatingOrderId(orderId);
    try {
      // First get the order to access its items
      const orderToUpdate = orders.find(o => o._id === orderId);
      
      let updateData = { status };
      
      // If marking as delivered, calculate factory cost and profit
      if (status === 'delivered') {
        let totalFactoryCost = 0;
        const items = orderToUpdate.items || orderToUpdate.cart || [];
        
        // Calculate factory cost for each item
        for (const item of items) {
          // Try to get factory price from the item or fetch from product
          let factoryPrice = item.factoryPrice;
          if (!factoryPrice && item.id) {
            try {
              const productRes = await fetch(`/api/products/${item.id}`);
              const productData = await productRes.json();
              if (productData.success && productData.product) {
                factoryPrice = productData.product.factoryPrice || item.price;
              }
            } catch (err) {
              console.error("Error fetching product:", err);
            }
          }
          factoryPrice = factoryPrice || item.price || 0;
          totalFactoryCost += factoryPrice * (item.quantity || 1);
        }
        
        const actualProfit = (orderToUpdate.totalAmount || 0) - totalFactoryCost;
        updateData.totalFactoryCost = totalFactoryCost;
        updateData.actualProfit = actualProfit;
        updateData.profitMargin = totalFactoryCost > 0 ? (actualProfit / totalFactoryCost * 100) : 0;
      }
      
      const res = await fetch(`/api/orders/${orderId}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(updateData) 
      });
      
      if (res.ok) { 
        await fetchOrders(); 
        alert(`Order status updated to ${status}!`); 
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
      setUpdatingOrderId(null);
    }
  };

  const updateCommissionStatus = async (orderId, commissionStatus) => {
    setUpdating(true);
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ commissionStatus }) 
      });
      if (res.ok) { 
        await fetchOrders(); 
        alert(`Commission marked as ${commissionStatus}!`); 
      } else {
        alert('Failed to update commission status');
      }
    } catch (error) {
      console.error('Error updating commission:', error);
      alert('Failed to update commission status');
    } finally {
      setUpdating(false);
      setUpdatingOrderId(null);
    }
  };

  const deleteOrder = async () => {
    if (!orderToDelete) return;
    const res = await fetch(`/api/orders/${orderToDelete._id}`, { method: 'DELETE' });
    if (res.ok) { 
      await fetchOrders(); 
      setOrderToDelete(null); 
      alert('Order deleted successfully'); 
    } else {
      alert('Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCommissionStatusColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const getProfitColor = (profit) => {
    if (profit > 1000) return 'text-green-600';
    if (profit > 0) return 'text-green-500';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getMarginColor = (margin) => {
    if (margin > 50) return 'bg-green-100 text-green-800';
    if (margin > 20) return 'bg-blue-100 text-blue-800';
    if (margin > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const copyOrderId = async (order) => {
    const orderIdToCopy = order.orderId || order._id;
    try {
      await navigator.clipboard.writeText(orderIdToCopy);
      setCopySuccess(order._id);
      alert(`Order ID copied: ${orderIdToCopy}\n\nUse this ID to track your order on the tracking page.`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy Order ID');
    }
  };

  const getDisplayOrderId = (order) => {
    if (order.orderId) return order.orderId;
    return `ORD-${order._id?.slice(-8).toUpperCase()}`;
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <DocumentTextIcon className="h-6 w-6 mb-1" />
          <p className="text-xl font-bold">{orders.length}</p>
          <p className="text-xs">Total Orders</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <CurrencyRupeeIcon className="h-6 w-6 mb-1" />
          <p className="text-xl font-bold">{formatPrice(totalRevenue)}</p>
          <p className="text-xs">Total Revenue</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <CurrencyRupeeIcon className="h-6 w-6 mb-1" />
          <p className="text-xl font-bold">{formatPrice(totalFactoryCost)}</p>
          <p className="text-xs">Factory Cost</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <ChartBarIcon className="h-6 w-6 mb-1" />
          <p className="text-xl font-bold">{formatPrice(totalProfit)}</p>
          <p className="text-xs">Total Profit</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white">
          <UserGroupIcon className="h-6 w-6 mb-1" />
          <p className="text-xl font-bold">{totalSellerOrders}</p>
          <p className="text-xs">Seller Orders</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <GiftIcon className="h-6 w-6 mb-1" />
          <p className="text-xl font-bold">{formatPrice(totalCommission)}</p>
          <p className="text-xs">Total Commission</p>
        </div>
      </div>

      {/* Source Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            <button
              onClick={() => setFilterSource('all')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                filterSource === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Orders
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => setFilterSource('customer')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                filterSource === 'customer'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Orders
              <span className="ml-2 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
                {orders.filter(o => o.source !== 'seller_portal').length}
              </span>
            </button>
            <button
              onClick={() => setFilterSource('seller_portal')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                filterSource === 'seller_portal'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller Orders
              {totalSellerOrders > 0 && (
                <span className="ml-2 bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs">
                  {totalSellerOrders}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Status Filter Navbar */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveStatus('all')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeStatus === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setActiveStatus('pending')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeStatus === 'pending'
                  ? 'border-b-2 border-yellow-500 text-yellow-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveStatus('processing')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeStatus === 'processing'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Processing ({processingCount})
            </button>
            <button
              onClick={() => setActiveStatus('shipped')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeStatus === 'shipped'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shipped ({shippedCount})
            </button>
            <button
              onClick={() => setActiveStatus('delivered')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeStatus === 'delivered'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Delivered ({deliveredCount})
            </button>
            <button
              onClick={() => setActiveStatus('cancelled')}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeStatus === 'cancelled'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </nav>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer/Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factory Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                   </td>
                 </tr>
              ) : (
                filteredOrders.map(order => {
                  const profit = (order.totalAmount || 0) - (order.totalFactoryCost || 0);
                  const margin = order.totalFactoryCost > 0 ? (profit / order.totalFactoryCost * 100).toFixed(1) : 0;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="font-mono text-sm font-bold text-purple-600">
                              {getDisplayOrderId(order)}
                            </div>
                            <button 
                              onClick={() => copyOrderId(order)}
                              className="text-gray-400 hover:text-blue-600 transition p-1"
                              title="Copy Order ID"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            {copySuccess === order._id && (
                              <span className="text-xs text-green-600">Copied!</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.source === 'seller_portal' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.source === 'seller_portal' ? 'Seller' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.source === 'seller_portal' 
                            ? order.sellerInfo?.sellerId || 'N/A'
                            : order.customer?.name || order.customerInfo?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          {order.source === 'seller_portal'
                            ? order.sellerInfo?.phone || 'N/A'
                            : order.customer?.phone || order.customerInfo?.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-purple-600">
                          {formatPrice(order.totalAmount || order.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-orange-600">
                          {formatPrice(order.totalFactoryCost)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-semibold ${getProfitColor(profit)}`}>
                          {formatPrice(profit)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMarginColor(margin)}`}>
                          {margin}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.source === 'seller_portal' ? (
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-green-600">
                              {formatPrice(order.commission)}
                            </div>
                            <select
                              value={order.commissionStatus || 'pending'}
                              onChange={(e) => updateCommissionStatus(order._id, e.target.value)}
                              disabled={updating && updatingOrderId === order._id}
                              className={`text-xs px-2 py-1 rounded-full ${getCommissionStatusColor(order.commissionStatus || 'pending')}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order._id, e.target.value)} 
                            disabled={updating && updatingOrderId === order._id}
                            className={`px-3 py-1 text-xs rounded-full font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="processing">⚙️ Processing</option>
                            <option value="shipped">📦 Shipped</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                          {updating && updatingOrderId === order._id && (
                            <span className="text-xs text-gray-500">Updating...</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)} 
                          className="text-blue-600 hover:text-blue-800 transition p-1"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setOrderToDelete(order)} 
                          className="text-red-600 hover:text-red-800 transition p-1"
                          title="Delete Order"
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
        
        {/* Order Details Section */}
        {selectedOrder && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Order Details
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const order = orders.find(o => o._id === selectedOrder);
              if (!order) return null;
              
              const profit = (order.totalAmount || 0) - (order.totalFactoryCost || 0);
              const margin = order.totalFactoryCost > 0 ? (profit / order.totalFactoryCost * 100).toFixed(1) : 0;
              
              return (
                <>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Order Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono font-bold text-purple-600">{getDisplayOrderId(order)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Type</p>
                        <p className="font-medium">
                          {order.source === 'seller_portal' ? 'Seller Order' : 'Customer Order'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Profit Margin</p>
                        <p className={`font-semibold ${margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {margin}%
                        </p>
                      </div>
                      {order.source === 'seller_portal' && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Seller ID</p>
                            <p className="font-medium">{order.sellerInfo?.sellerId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Commission Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs ${getCommissionStatusColor(order.commissionStatus || 'pending')}`}>
                              {order.commissionStatus || 'pending'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Customer/Seller Information */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      {order.source === 'seller_portal' ? 'Seller Information' : 'Customer Information'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {order.source === 'seller_portal' 
                            ? order.sellerInfo?.sellerId 
                            : order.customer?.name || order.customerInfo?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          {order.source === 'seller_portal'
                            ? order.sellerInfo?.phone || 'N/A'
                            : order.customer?.phone || order.customerInfo?.phone || 'N/A'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Delivery Address</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {order.source === 'seller_portal'
                            ? order.sellerInfo?.address ? 
                              `${order.sellerInfo.address.area}, ${order.sellerInfo.address.city}` : 'N/A'
                            : order.customer?.address ? 
                              `${order.customer.address.area}, ${order.customer.address.city}` : 
                              order.customerInfo?.address ? 
                                `${order.customerInfo.address.area}, ${order.customerInfo.address.city}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items with Factory Price */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {(order.items || order.cart || []).map((item, idx) => {
                        const itemProfit = (item.price || item.productPrice || 0) - (item.factoryPrice || 0);
                        return (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × Selling: {formatPrice(item.price || item.productPrice)}
                              </p>
                              {item.factoryPrice && (
                                <p className="text-xs text-gray-400">
                                  Factory Cost: {formatPrice(item.factoryPrice * item.quantity)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatPrice((item.price || item.productPrice) * item.quantity)}
                              </p>
                              {item.factoryPrice && (
                                <p className={`text-xs ${itemProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  Profit: {formatPrice(itemProfit * item.quantity)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Order Summary with Profit */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatPrice(order.totalAmount || order.total)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Factory Cost:</span>
                        <span className="text-orange-600">{formatPrice(order.totalFactoryCost)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Profit:</span>
                        <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPrice(profit)} ({margin}%)
                        </span>
                      </div>
                      {order.source === 'seller_portal' && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Commission (10%):</span>
                          <span className="text-green-600 font-semibold">{formatPrice(order.commission)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total Amount:</span>
                          <span className="font-bold text-xl text-purple-600">
                            {formatPrice(order.totalAmount || order.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {orderToDelete && (
        <DeleteModal 
          title="Delete Order" 
          message={`Delete order ${getDisplayOrderId(orderToDelete)}? This action cannot be undone.`} 
          onConfirm={deleteOrder} 
          onCancel={() => setOrderToDelete(null)} 
        />
      )}
    </>
  );
}