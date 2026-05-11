import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Order from "../../models/Order";
import User from "../../models/User";

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { customer, cart, totalAmount, referralCode } = body;
    
    let seller = null;
    let commission = 0;
    const commissionRate = 0.10;
    
    // If there's a referral code, find the seller
    if (referralCode && referralCode !== 'null' && referralCode !== 'undefined') {
      seller = await User.findOne({ referralCode, role: 'seller' });
      
      if (seller) {
        commission = totalAmount * commissionRate;
        
        // Update seller's commission in User model
        await User.findByIdAndUpdate(seller._id, {
          $inc: { 
            pendingCommission: commission, 
            totalCommission: commission 
          },
          $addToSet: { 
            referredCustomers: customer.email 
          }
        });
      }
    }
    
    // Generate unique order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create order with referral info
    const order = await Order.create({
      orderId: orderId,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address
      },
      items: cart.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        productPrice: item.price
      })),
      totalAmount: totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: body.paymentMethod || 'cod',
      
      // Referral fields
      referredBy: seller ? seller.referralCode : null,
      referredBySellerId: seller ? seller._id : null,
      commission: commission,
      commissionRate: commissionRate,
      commissionStatus: 'pending'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderId: order.orderId,
      commission: commission,
      referredBy: referralCode || 'none'
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}