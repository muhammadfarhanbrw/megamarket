// app/(components)/dashboard/components/SliderManager.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CloudArrowUpIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function SliderManager() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: 'Shop Now',
    category: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/slider');
      const data = await res.json();
      if (data.success) setSliders(data.sliders);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData({ ...formData, imageUrl: data.url });
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      alert('Please upload an image first');
      return;
    }

    const url = '/api/slider';
    const method = 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingSlider ? { ...formData, _id: editingSlider._id } : formData),
    });
    
    if (response.ok) {
      fetchSliders();
      setShowModal(false);
      resetForm();
      alert(editingSlider ? 'Slide updated!' : 'Slide created!');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this slide?')) {
      await fetch(`/api/slider?id=${id}`, { method: 'DELETE' });
      fetchSliders();
      alert('Slide deleted!');
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData(slider);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      buttonText: 'Shop Now',
      category: '',
      order: 0,
      isActive: true
    });
    setEditingSlider(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const moveSlide = async (id, direction) => {
    const index = sliders.findIndex(s => s._id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sliders.length) return;
    
    const newSliders = [...sliders];
    [newSliders[index], newSliders[newIndex]] = [newSliders[newIndex], newSliders[index]];
    
    // Update orders
    for (let i = 0; i < newSliders.length; i++) {
      await fetch('/api/slider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSliders[i], order: i })
      });
    }
    fetchSliders();
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Slider Manager</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" /> Add Slide
        </button>
      </div>

      {sliders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No slides yet. Click "Add Slide" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sliders.map((slider, idx) => (
            <div key={slider._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex gap-4">
                <img src={slider.imageUrl} alt={slider.title} className="w-32 h-24 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{slider.title}</h3>
                      <p className="text-sm text-gray-600">{slider.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{slider.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Order: {slider.order}</span>
                        <span className={`text-xs px-2 py-1 rounded ${slider.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {slider.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => moveSlide(slider._id, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-50">
                        <ArrowUpIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => moveSlide(slider._id, 'down')} disabled={idx === sliders.length-1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-50">
                        <ArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleEdit(slider)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(slider._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form with Image Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingSlider ? 'Edit Slide' : 'New Slide'}</h3>
                <button onClick={() => setShowModal(false)}><XMarkIcon className="h-6 w-6" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Title" required
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
                
                <input type="text" placeholder="Subtitle" required
                  value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
                
                <textarea placeholder="Description" rows="3" required
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      disabled={uploading}
                      className="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <CloudArrowUpIcon className="h-5 w-5" />
                      {uploading ? 'Uploading...' : 'Click to Upload Image'}
                    </button>
                  </div>
                  
                  {formData.imageUrl && (
                    <div className="mt-3">
                      <img src={formData.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg" />
                      <p className="text-xs text-green-600 mt-1">✓ Image uploaded successfully</p>
                    </div>
                  )}
                </div>
                
                <input type="text" placeholder="Button Text (e.g., Shop Now)"
                  value={formData.buttonText} onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
                
                <input type="text" placeholder="Category (e.g., Fashion, Electronics)"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2" />
                
                <input type="number" placeholder="Order (0, 1, 2...)"
                  value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2" />
                
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} />
                  <span>Active (show on website)</span>
                </label>
                
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg" disabled={uploading || !formData.imageUrl}>
                    {editingSlider ? 'Update' : 'Create'} Slide
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border rounded-lg py-2">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}