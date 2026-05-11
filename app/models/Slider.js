// models/Slider.js
import mongoose from 'mongoose';

const SliderSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  imageUrl: String,  // Just store the URL
  buttonText: String,
  category: String,
  order: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Slider || mongoose.model('Slider', SliderSchema);