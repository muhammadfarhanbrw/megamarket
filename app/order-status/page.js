'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);
    
    try {
      // Send the order ID as is - the API will handle different formats
      const response = await fetch(`/api/orders/track/${encodeURIComponent(orderId.trim())}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found. Please check your Order ID and try again.');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-8 w-8 text-yellow-500" />;
      case 'confirmed':
        return <ShoppingBagIcon className="h-8 w-8 text-blue-500" />;
      case 'processing':
        return <ShoppingBagIcon className="h-8 w-8 text-purple-500" />;
      case 'shipped':
        return <TruckIcon className="h-8 w-8 text-indigo-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-8 w-8 text-red-500" />;
      default:
        return <ClockIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusMessage = (status) => {
    const messages = {
      pending: 'Your order has been received and is awaiting confirmation.',
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed and packed.',
      shipped: 'Your order has been shipped and is on the way!',
      delivered: 'Your order has been delivered. Enjoy your purchase!',
      cancelled: 'Your order has been cancelled.'
    };
    return messages[status] || 'Your order is being processed.';
  };

  const getProgressSteps = (currentStatus) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
      { key: 'confirmed', label: 'Confirmed', description: 'Order has been confirmed' },
      { key: 'processing', label: 'Processing', description: 'Preparing your items' },
      { key: 'shipped', label: 'Shipped', description: 'Order is on the way' },
      { key: 'delivered', label: 'Delivered', description: 'Order has been delivered' }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: step.key === currentStatus
    }));
  };

  // Helper function to display order ID consistently
  const displayOrderId = (order) => {
    if (order.orderId) return order.orderId;
    return order._id.slice(-8);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID to check the current status of your order</p>
          <p className="text-sm text-gray-500 mt-2">
            Enter the Order ID shown in your order confirmation (e.g., {Math.random().toString(36).substring(2, 10).toUpperCase()})
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., 65f2a1b3)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can find your Order ID in your order confirmation email or SMS (last 8 characters)
              </p>
            </div>
            <div className="sm:self-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching your order details...</p>
          </div>
        )}

        {/* Order Details */}
        {!loading && searched && order && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order #{displayOrderId(order)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className={`mt-2 sm:mt-0 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                  <span className="font-semibold capitalize">{order.status}</span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mt-6">
                <div className="relative">
                  <div className="overflow-x-auto">
                    <div className="flex justify-between min-w-125">
                      {getProgressSteps(order.status).map((step, index) => (
                        <div key={step.key} className="flex-1 text-center">
                          <div className="relative">
                            <div className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-green-500' : step.current ? 'bg-blue-500' : 'bg-gray-300'
                            }`}>
                              {step.completed ? (
                                <CheckCircleIcon className="h-5 w-5 text-white" />
                              ) : step.current ? (
                                <div className="animate-pulse h-3 w-3 bg-white rounded-full"></div>
                              ) : (
                                <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                              )}
                            </div>
                            {index < getProgressSteps(order.status).length - 1 && (
                              <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                                step.completed && getProgressSteps(order.status)[index + 1].completed ? 'bg-green-500' : 
                                step.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`} style={{ transform: 'translateY(-50%)' }}></div>
                            )}
                          </div>
                          <div className="mt-2">
                            <p className={`text-sm font-medium ${
                              step.completed ? 'text-green-600' : step.current ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 hidden sm:block">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{getStatusMessage(order.status)}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.customer?.name || order.customerInfo?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{order.customer?.phone || order.customerInfo?.phone || 'N/A'}</p>
                </div>
                {order.customer?.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{order.customer.email}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium text-gray-900">
                    {order.customer?.address ? 
                      `${order.customer.address.area}, ${order.customer.address.city}` :
                      order.customerInfo?.address ? 
                        `${order.customerInfo.address.area}, ${order.customerInfo.address.city}` : 
                        'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {(order.items || order.cart || []).map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="font-semibold text-gray-900">Rs: {((item.price || item.productPrice) * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Rs: {(item.price || item.productPrice).toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">Rs: {(order.totalAmount || order.total).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-800 text-sm mb-3">
                If you have any questions about your order, please contact our customer support:
              </p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>📞 Phone: +92 XXX XXXXXXX</p>
                <p>✉️ Email: support@megamarkeet.com</p>
              </div>
            </div>
          </div>
        )}

        {/* No Order Found State */}
        {!loading && searched && !order && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Order Found</h3>
            <p className="text-gray-600">
              We couldn't find an order with that ID. Please check and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}