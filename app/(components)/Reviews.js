// app/(components)/Reviews.js
'use client';

import { useState, useEffect } from 'react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    comment: '',
    orderId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    
    // Check if user is logged in and pre-fill form
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          customerName: user.name || user.email?.split('@')[0] || '',
          customerEmail: user.email || ''
        }));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?approved=true&limit=20');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, averageRating: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Thank you for your review! It will be visible after admin approval.');
        setShowForm(false);
        setFormData(prev => ({
          ...prev,
          rating: 5,
          title: '',
          comment: '',
          orderId: ''
        }));
        fetchReviews();
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            {star <= rating ? (
              <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 text-black">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <p className="text-purple-100 mt-1">What our customers say about us</p>
      </div>
      
      {/* Rating Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">{stats.averageRating}</div>
            <div className="flex justify-center mt-2">
              <StarRating rating={Math.round(stats.averageRating)} />
            </div>
            <div className="text-sm text-gray-500 mt-1">Based on {stats.total} reviews</div>
          </div>
          
          <div className="flex-1 max-w-md">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star] || 0;
              const percentage = stats.total > 0 ? (count / stats.total * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 mb-2">
                  <div className="w-12 text-sm text-gray-600">{star} ★</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-500">{count}</div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Write a Review
          </button>
        </div>
      </div>
      
      {/* Review Form */}
      {showForm && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email *</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rating *</label>
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(rating) => setFormData({...formData, rating})}
                interactive={true}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Review Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Your Review *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                rows="4"
                placeholder="Share your experience with our products and services..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Order ID (Optional)</label>
              <input
                type="text"
                value={formData.orderId}
                onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                placeholder="If you have an order ID, please enter it"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No reviews yet. Be the first to write a review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{review.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-500">
                      by {review.customerName}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}