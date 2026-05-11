// app/(components)/dashboard/components/ShareProductModal.js
'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, UsersIcon, DevicePhoneMobileIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ShareProductModal({ product, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [notificationType, setNotificationType] = useState('email'); // email, sms, both
  const [sent, setSent] = useState(false);
  const [sharingMethod, setSharingMethod] = useState('all'); // all, selected

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        // Filter out admin users if you don't want to share with admins
        const regularUsers = data.users.filter(user => user.role !== 'admin');
        setUsers(regularUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      if (selectedUsers.length + 1 === users.length) {
        setSelectAll(true);
      }
    }
  };

  const handleShare = async () => {
    const usersToShare = sharingMethod === 'all' 
      ? users.map(user => user._id)
      : selectedUsers;

    if (usersToShare.length === 0) {
      alert('Please select at least one user to share with');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/share-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.image,
          productDescription: product.description,
          userIds: usersToShare,
          notificationType: notificationType
        })
      });

      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        alert(data.message || 'Failed to share product');
      }
    } catch (error) {
      console.error('Error sharing product:', error);
      alert('Failed to share product');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Shared Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Product has been shared with {sharingMethod === 'all' ? 'all users' : `${selectedUsers.length} user(s)`}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Share Product</h2>
            <p className="text-purple-100 text-sm">Share "{product?.name}" with users</p>
          </div>
          <button onClick={onClose} className="hover:opacity-80 transition">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            {product?.image && (
              <img src={product.image} alt={product.name} className="h-16 w-16 object-cover rounded-lg" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{product?.name}</h3>
              <p className="text-sm text-gray-600">{product?.description?.substring(0, 100)}</p>
              <p className="text-lg font-bold text-green-600 mt-1">₹{product?.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Sharing Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Share with:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={sharingMethod === 'all'}
                  onChange={(e) => setSharingMethod(e.target.value)}
                  className="mr-2"
                />
                <UsersIcon className="h-4 w-4 mr-1" />
                All Users ({users.length})
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="selected"
                  checked={sharingMethod === 'selected'}
                  onChange={(e) => setSharingMethod(e.target.value)}
                  className="mr-2"
                />
                <UsersIcon className="h-4 w-4 mr-1" />
                Select Specific Users
              </label>
            </div>
          </div>

          {/* Notification Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Send via:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={notificationType === 'email'}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="mr-2"
                />
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Email Only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sms"
                  checked={notificationType === 'sms'}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="mr-2"
                />
                <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                SMS Only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="both"
                  checked={notificationType === 'both'}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="mr-2"
                />
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                Both
              </label>
            </div>
          </div>

          {/* User Selection Table (only shown if sharingMethod is 'selected') */}
          {sharingMethod === 'selected' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Select Users:</label>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {selectAll ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">User</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleSelectUser(user._id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{user.name || 'N/A'}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-800">
              <strong>Summary:</strong> Will share with{' '}
              {sharingMethod === 'all' 
                ? `${users.length} users` 
                : `${selectedUsers.length} selected user(s)`}
              {' '}via {notificationType === 'email' ? 'Email' : notificationType === 'sms' ? 'SMS' : 'Email & SMS'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              disabled={sending || (sharingMethod === 'selected' && selectedUsers.length === 0)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition font-semibold"
            >
              {sending ? 'Sharing...' : 'Share Product'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}