// app/(components)/dashboard/components/SellersTab.js
'use client';

import { useState, useEffect } from 'react';

export default function SellersTab({ orders, sellers }) {
  const [sellerStats, setSellerStats] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Helper function to format numbers - properly handles floating point issues
  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
    
    // Convert to number and fix floating point precision
    let num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '₹0';
    
    // Round to 2 decimal places first to fix issues like 22.200000000000003
    num = Math.round(num * 100) / 100;
    
    // Format without decimals for clean display
    const rounded = Math.round(num);
    return `₹${rounded.toLocaleString('en-IN')}`;
  };

  // Function to clean and round numbers before storing
  const cleanNumber = (num) => {
    if (!num) return 0;
    return Math.round((typeof num === 'string' ? parseFloat(num) : num) * 100) / 100;
  };

  useEffect(() => {
    // Calculate statistics for each seller with cleaned numbers
    const sellerOrders = orders.filter(o => o.source === 'seller_portal' && o.sellerInfo);
    const statsMap = new Map();
    
    sellerOrders.forEach(order => {
      const sellerId = order.sellerInfo?.sellerId;
      if (!sellerId) return;
      
      // Clean the commission value
      const cleanedCommission = cleanNumber(order.commission);
      
      if (!statsMap.has(sellerId)) {
        statsMap.set(sellerId, {
          sellerId: sellerId,
          phone: order.sellerInfo?.phone || 'N/A',
          totalOrders: 0,
          totalAmount: 0,
          totalCommission: 0,
          pendingCommission: 0,
          paidCommission: 0,
          orders: [],
          lastOrderDate: null
        });
      }
      
      const stats = statsMap.get(sellerId);
      stats.totalOrders++;
      stats.totalAmount += cleanNumber(order.totalAmount);
      stats.totalCommission += cleanedCommission;
      if (order.commissionStatus === 'pending') {
        stats.pendingCommission += cleanedCommission;
      } else {
        stats.paidCommission += cleanedCommission;
      }
      stats.orders.push({
        ...order,
        commission: cleanedCommission,
        totalAmount: cleanNumber(order.totalAmount)
      });
      
      const orderDate = new Date(order.orderDate);
      if (!stats.lastOrderDate || orderDate > stats.lastOrderDate) {
        stats.lastOrderDate = orderDate;
      }
    });
    
    // Round all totals
    const cleanedStats = Array.from(statsMap.values()).map(stat => ({
      ...stat,
      totalAmount: Math.round(stat.totalAmount),
      totalCommission: Math.round(stat.totalCommission),
      pendingCommission: Math.round(stat.pendingCommission),
      paidCommission: Math.round(stat.paidCommission)
    }));
    
    setSellerStats(cleanedStats);
  }, [orders]);

  const updateCommissionStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionStatus: status })
      });
      
      if (response.ok) {
        alert(`Commission marked as ${status}`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating commission:', error);
    }
  };

  const filteredOrders = selectedSeller 
    ? sellerStats.find(s => s.sellerId === selectedSeller)?.orders || []
    : [];

  return (
    <div className="space-y-6">
      {/* Seller Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sellerStats.map((seller) => (
          <div key={seller.sellerId} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
              <h3 className="font-bold text-lg truncate" title={seller.sellerId}>{seller.sellerId}</h3>
              <p className="text-purple-100 text-sm">Phone: {seller.phone}</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{seller.totalOrders}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800 truncate" title={`₹${seller.totalAmount.toLocaleString('en-IN')}`}>
                    ₹{seller.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs">Total Commission</p>
                  <p className="text-2xl font-bold text-green-600 truncate" title={`₹${seller.totalCommission.toLocaleString('en-IN')}`}>
                    ₹{seller.totalCommission.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-xs">Pending Commission</p>
                  <p className="text-2xl font-bold text-orange-600 truncate" title={`₹${seller.pendingCommission.toLocaleString('en-IN')}`}>
                    ₹{seller.pendingCommission.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSeller(selectedSeller === seller.sellerId ? null : seller.sellerId)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                {selectedSeller === seller.sellerId ? 'Hide Orders' : 'View Orders'}
              </button>
            </div>
          </div>
        ))}
        
        {sellerStats.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No seller orders found yet</p>
          </div>
        )}
      </div>

      {/* Seller Orders Details */}
      {selectedSeller && filteredOrders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 p-4">
            <h3 className="text-xl font-bold text-white">Orders for {selectedSeller}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Items</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Commission</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-200">
                    <td className="p-3 text-sm text-gray-800 font-mono break-all max-w-[150px]">{order.orderId}</td>
                    <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{order.items?.length || 0} items</td>
                    <td className="p-3 text-sm font-semibold text-gray-800 whitespace-nowrap">₹{Math.round(order.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-sm font-semibold text-green-600 whitespace-nowrap">₹{Math.round(order.commission).toLocaleString('en-IN')}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.commissionStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.commissionStatus || 'pending'}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {order.commissionStatus !== 'paid' && (
                        <button
                          onClick={() => updateCommissionStatus(order._id, 'paid')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="p-3 text-right font-bold">Totals:</td>
                  <td className="p-3 font-bold text-gray-800 whitespace-nowrap">
                    ₹{Math.round(filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 font-bold text-green-600 whitespace-nowrap">
                    ₹{Math.round(filteredOrders.reduce((sum, o) => sum + (o.commission || 0), 0)).toLocaleString('en-IN')}
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}