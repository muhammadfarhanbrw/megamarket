// app/api/notifications/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Notification from "../../models/Notification";
import { verifyToken } from '../../lib/auth';

// GET - Fetch notifications for admin
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    
    let filter = {};
    if (unreadOnly) {
      filter.isRead = false;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .populate('orderId', 'customer totalAmount status');
    
    return NextResponse.json({ success: true, notifications }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Mark notification as read
export async function PATCH(request) {
  try {
    await connectToDatabase();
    const { notificationId } = await request.json();
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, notification }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}