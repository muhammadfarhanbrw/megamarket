import mongoose from 'mongoose';

const PayoutRequestSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
    index: true
  },
  sellerName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  totalOrders: {
    type: Number,
    required: true
  },
  products: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.models.PayoutRequest || mongoose.model('PayoutRequest', PayoutRequestSchema);