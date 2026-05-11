// app/models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    sparse: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: {
      area: String,
      city: String,
      fullAddress: String
    }
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String,
    address: {
      area: String,
      city: String
    }
  },
  items: [{
    id: String,
    name: String,
    price: Number, // Selling price at time of order
    quantity: Number,
    image: String,
    productPrice: Number,
    factoryPrice: { type: Number, default: 0 } // Factory price at time of order
  }],
  cart: [{
    name: String,
    quantity: Number,
    price: Number,
    productPrice: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  
  // NEW REFERRAL FIELDS
  referredBy: { 
    type: String, 
    default: null 
  },
  referredBySellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  commission: { 
    type: Number, 
    default: 0 
  },
  commissionRate: { 
    type: Number, 
    default: 0.10 
  },
  commissionStatus: { 
    type: String, 
    enum: ['pending', 'paid'], 
    default: 'pending' 
  },
  
  // NEW PROFIT TRACKING FIELDS
  source: { 
    type: String, 
    enum: ['customer', 'seller_portal', 'referral'],
    default: 'customer' 
  },
  sellerInfo: {
    sellerId: String,
    name: String,
    phone: String,
    address: {
      city: String,
      area: String
    }
  },
  totalFactoryCost: { 
    type: Number, 
    default: 0 
  }, // Total cost from factory
  actualProfit: { 
    type: Number, 
    default: 0 
  }, // Actual profit = totalAmount - totalFactoryCost
  profitMargin: { 
    type: Number, 
    default: 0 
  } // Profit percentage
}, {
  timestamps: true
});

// Create indexes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ referredBy: 1 });
OrderSchema.index({ referredBySellerId: 1 });
OrderSchema.index({ source: 1 });
OrderSchema.index({ 'sellerInfo.sellerId': 1 });

// Method to calculate profit
OrderSchema.methods.calculateProfit = function() {
  if (this.totalFactoryCost > 0) {
    this.actualProfit = this.totalAmount - this.totalFactoryCost;
    this.profitMargin = (this.actualProfit / this.totalFactoryCost) * 100;
  }
  return this;
};

// Static method to get seller statistics
OrderSchema.statics.getSellerStats = async function(sellerId) {
  const orders = await this.find({ 
    'sellerInfo.sellerId': sellerId,
    source: 'seller_portal'
  });
  
  const totalOrders = orders.length;
  const totalCommission = orders.reduce((sum, order) => sum + (order.commission || 0), 0);
  const pendingCommission = orders.filter(o => o.commissionStatus === 'pending').reduce((sum, o) => sum + (o.commission || 0), 0);
  const paidCommission = orders.filter(o => o.commissionStatus === 'paid').reduce((sum, o) => sum + (o.commission || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalProfit = orders.reduce((sum, order) => sum + (order.actualProfit || 0), 0);
  
  return {
    totalOrders,
    totalCommission,
    pendingCommission,
    paidCommission,
    deliveredOrders,
    totalProfit
  };
};

// Static method to get profit history for a seller
OrderSchema.statics.getProfitHistory = async function(sellerId) {
  return await this.find({ 
    'sellerInfo.sellerId': sellerId,
    source: 'seller_portal',
    status: 'delivered'
  }).sort({ orderDate: -1 });
};

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);