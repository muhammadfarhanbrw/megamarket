import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import User from "../../../models/User";

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sellerEmail = searchParams.get('sellerId');
    
    if (!sellerEmail) {
      return NextResponse.json({ error: 'Seller ID required' }, { status: 400 });
    }
    
    const seller = await User.findOne({ email: sellerEmail, role: 'seller' });
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    
    // Get all orders referred by this seller
    const orders = await Order.find({ 
      referredBySellerId: seller._id 
    }).sort({ createdAt: -1 });
    
    // Calculate stats
    let totalSales = 0;
    let totalCommission = 0;
    let paidCommission = 0;
    
    orders.forEach(order => {
      totalSales += order.totalAmount || 0;
      totalCommission += order.commission || 0;
      if (order.commissionStatus === 'paid') {
        paidCommission += order.commission || 0;
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        orders: orders,
        totalSales,
        totalCommission,
        paidCommission,
        pendingCommission: totalCommission - paidCommission,
        commissionRate: 0.10,
        totalReferrals: orders.length
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}