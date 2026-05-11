// app/(components)/dashboard/components/ReviewsTab.js
'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id, isApproved) => {
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Review ${isApproved ? 'approved' : 'rejected'} successfully`);
        fetchReviews();
      } else {
        alert(data.error || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Network error');
    }
  };

  const deleteReview = async (id) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/reviews?id=${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('Review deleted successfully');
          fetchReviews();
        } else {
          alert(data.error || 'Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Network error');
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.isApproved;
    if (filter === 'approved') return review.isApproved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <p className="text-gray-600">Manage customer reviews and feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm">Total Reviews</p>
          <p className="text-2xl font-bold">{reviews.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p className="text-sm">Approved</p>
          <p className="text-2xl font-bold">{reviews.filter(r => r.isApproved).length}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <p className="text-sm">Pending Approval</p>
          <p className="text-2xl font-bold">{reviews.filter(r => !r.isApproved).length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 text-sm font-medium ${
                filter === 'all'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 text-sm font-medium ${
                filter === 'pending'
                  ? 'border-b-2 border-yellow-500 text-yellow-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-3 text-sm font-medium ${
                filter === 'approved'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Approved
            </button>
          </nav>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No reviews found
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{review.customerName}</p>
                        <p className="text-sm text-gray-500">{review.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{review.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{review.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        review.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!review.isApproved && (
                        <button
                          onClick={() => updateReviewStatus(review._id, true)}
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {review.isApproved && (
                        <button
                          onClick={() => updateReviewStatus(review._id, false)}
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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
    </div>
  );
}