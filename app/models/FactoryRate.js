// app/models/FactoryRate.js
import mongoose from 'mongoose';

const FactoryRateSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  factoryPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: 1
  },
  supplier: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual field to calculate profit margin percentage
FactoryRateSchema.virtual('profitMargin').get(function() {
  if (this.factoryPrice === 0) return 0;
  return ((this.sellingPrice - this.factoryPrice) / this.factoryPrice * 100).toFixed(1);
});

// Virtual field to calculate profit amount
FactoryRateSchema.virtual('profitAmount').get(function() {
  return this.sellingPrice - this.factoryPrice;
});

// Virtual field to get formatted prices
FactoryRateSchema.virtual('formattedFactoryPrice').get(function() {
  return `₹${Math.round(this.factoryPrice).toLocaleString('en-IN')}`;
});

FactoryRateSchema.virtual('formattedSellingPrice').get(function() {
  return `₹${Math.round(this.sellingPrice).toLocaleString('en-IN')}`;
});

// Ensure virtuals are included when converting to JSON
FactoryRateSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});
FactoryRateSchema.set('toObject', { virtuals: true });

// Create indexes for better search performance
FactoryRateSchema.index({ category: 1 });
FactoryRateSchema.index({ productName: 1 });
FactoryRateSchema.index({ isActive: 1 });
FactoryRateSchema.index({ category: 1, productName: 1 }); // Compound index for common queries
FactoryRateSchema.index({ supplier: 1 }); // Index for supplier lookups

export default mongoose.models.FactoryRate || mongoose.model('FactoryRate', FactoryRateSchema);