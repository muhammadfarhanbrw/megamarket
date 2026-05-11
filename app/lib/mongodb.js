// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;



const connectToDatabase = async() =>{
  try {
   
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
   
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
export default connectToDatabase;