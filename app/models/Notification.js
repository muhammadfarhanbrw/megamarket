// app/models/Notification.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['new_order', 'order_update', 'payment', 'system'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: false 
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
});

// Check if the model exists before creating a new one
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;