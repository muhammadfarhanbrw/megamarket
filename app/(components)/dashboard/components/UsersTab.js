// app/(components)/dashboard/components/UsersTab.js
'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  ShoppingBagIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PencilIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    user: 0,
    seller: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
        setStats(data.stats || {
          total: data.users?.length || 0,
          admin: data.users?.filter(u => u.role === 'admin').length || 0,
          user: data.users?.filter(u => u.role === 'user').length || 0,
          seller: data.users?.filter(u => u.role === 'seller').length || 0
        });
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to connect to server. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdatingRole(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        
        // Update stats
        const oldUser = users.find(u => u._id === userId);
        if (oldUser) {
          setStats(prevStats => ({
            ...prevStats,
            [oldUser.role]: prevStats[oldUser.role] - 1,
            [newRole]: prevStats[newRole] + 1
          }));
        }
        
        setEditingRole(null);
        // Show success message
        const roleName = newRole.charAt(0).toUpperCase() + newRole.slice(1);
        alert(`User role updated to ${roleName} successfully!`);
      } else {
        alert(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setUpdatingRole(false);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`/api/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        alert('User deleted successfully');
        fetchUsers(); // Refresh the list
        setUserToDelete(null);
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
      seller: 'bg-green-100 text-green-800'
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <ShieldCheckIcon className="h-4 w-4" />;
      case 'seller': return <ShoppingBagIcon className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
  };

  // Role Selector Component
  const RoleSelector = ({ user }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const roles = [
      { value: 'user', label: 'User', color: 'blue' },
      { value: 'seller', label: 'Seller', color: 'green' },
      { value: 'admin', label: 'Admin', color: 'purple' }
    ];

    if (editingRole === user._id) {
      return (
        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={updatingRole}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => updateUserRole(user._id, selectedRole)}
            disabled={updatingRole}
            className="text-green-600 hover:text-green-800 transition"
            title="Save"
          >
            <CheckIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEditingRole(null)}
            disabled={updatingRole}
            className="text-gray-600 hover:text-gray-800 transition"
            title="Cancel"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${getRoleBadge(user.role)}`}>
          {getRoleIcon(user.role)}
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
        </span>
        <button
          onClick={() => setEditingRole(user._id)}
          className="text-gray-400 hover:text-blue-600 transition"
          title="Edit Role"
        >
          <PencilIcon className="h-3 w-3" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <UsersIcon className="h-8 w-8 mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p>Total Users</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <ShieldCheckIcon className="h-8 w-8 mb-2" />
          <p className="text-2xl font-bold">{stats.admin}</p>
          <p>Admins</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <UserIcon className="h-8 w-8 mb-2" />
          <p className="text-2xl font-bold">{stats.user}</p>
          <p>Customers</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <ShoppingBagIcon className="h-8 w-8 mb-2" />
          <p className="text-2xl font-bold">{stats.seller}</p>
          <p>Sellers</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterRole !== 'all' ? 'No users match your search' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {user.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleSelector user={user} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete User"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Delete User</h2>
              <button onClick={() => setUserToDelete(null)} className="hover:opacity-80 transition">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete user <strong>{userToDelete.name || userToDelete.email}</strong>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={deleteUser}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}