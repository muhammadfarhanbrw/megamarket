import { NextResponse } from 'next/server';
import connectToDatabase from "../../../../lib/mongodb";
import Order from "../../../../models/Order";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    // In Next.js 15+, params is a Promise that must be awaited
    const { id } = await params;
    
    console.log('Searching for order with ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    let order = null;
    
    // Method 1: Try to find by orderId field (e.g., ORD-20241226-0001)
    if (id.startsWith('ORD-')) {
      order = await Order.findOne({ orderId: id });
      console.log('Search by orderId:', order ? 'Found' : 'Not found');
    }
    
    // Method 2: Try to find by MongoDB _id (24 character hex)
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
      console.log('Search by _id:', order ? 'Found' : 'Not found');
    }
    
    // Method 3: Try to find by last 8 characters of _id
    if (!order && id.length <= 12) {
      const allOrders = await Order.find({});
      order = allOrders.find(o => o._id.toString().slice(-8) === id);
      console.log('Search by last 8 chars:', order ? 'Found' : 'Not found');
    }
    
    // Method 4: Try partial match on orderId
    if (!order && id.length >= 4) {
      const allOrders = await Order.find({});
      order = allOrders.find(o => 
        o.orderId && o.orderId.toLowerCase().includes(id.toLowerCase())
      );
      console.log('Search by partial orderId:', order ? 'Found' : 'Not found');
    }
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found. Please check your Order ID and try again.' },
        { status: 404 }
      );
    }
    
    // Convert to plain object and serialize MongoDB fields
    const serializedOrder = {
      ...order.toObject(),
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    };
    
    return NextResponse.json({ 
      success: true, 
      order: serializedOrder 
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details. Please try again later.' },
      { status: 500 }
    );
  }
}