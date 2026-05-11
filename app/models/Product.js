// app/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true, // Selling price (shown to customers)
  },
  factoryPrice: {
    type: Number,
    default: 0, // Factory cost price (for admin/seller only)
  },
  image: {
    type: String,       
    default: '',       
  },
  categories: {
    type: String,
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);