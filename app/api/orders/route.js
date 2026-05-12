
// app/api/orders/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Order from "../../models/Order";

// GET - Fetch orders with filters
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    
    let filter = {};
    
    if (sellerId) {
      filter['sellerInfo.sellerId'] = sellerId;
    }
    
    if (source) {
      filter.source = source;
    }
    
    if (status) {
      filter.status = status;
    }
    
    const orders = await Order.find(filter).sort({ orderDate: -1 });
    
    const serializedOrders = orders.map(order => ({
      ...order.toObject(),
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    }));
    
    return NextResponse.json({ 
      success: true, 
      orders: serializedOrders 
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log("Received order request:", JSON.stringify(body, null, 2));
    
    const { 
      orderId, 
      items, 
      totalAmount, 
      source,
      customer,
      sellerInfo 
    } = body;
    
    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      );
    }
    
    if (totalAmount === undefined || totalAmount === null) {
      return NextResponse.json(
        { success: false, error: 'Total amount is required' },
        { status: 400 }
      );
    }
    
    // Prepare order data based on source
    let orderData = {
      orderId: orderId,
      items: items,
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      orderDate: new Date(),
      source: source || 'customer'
    };
    
    // Handle customer orders (from regular cart)
    if (source === 'customer' && customer) {
      orderData.customer = {
        name: customer.name || 'Customer',
        phone: customer.phone || 'N/A',
        address: {
          area: customer.address?.area || '',
          city: customer.address?.city || ''
        }
      };
    } 
    // Handle seller orders (from seller portal)
    else if (source === 'seller_portal' && sellerInfo) {
      const commission = parseFloat(totalAmount) * 0.10;
      orderData = {
        ...orderData,
        customer: {
          name: sellerInfo.name || sellerInfo.sellerId || 'Seller',
          phone: sellerInfo.phone || 'N/A',
          address: {
            area: sellerInfo.address?.area || '',
            city: sellerInfo.address?.city || ''
          }
        },
        sellerInfo: {
          sellerId: sellerInfo.sellerId,
          name: sellerInfo.name,
          phone: sellerInfo.phone,
          address: sellerInfo.address
        },
        commission: commission,
        commissionRate: 0.10,
        commissionStatus: 'pending',
        referredBy: sellerInfo.sellerId
      };
    }
    // Handle referral orders
    else if (source === 'referral' && customer) {
      const commission = parseFloat(totalAmount) * 0.10;
      orderData = {
        ...orderData,
        customer: {
          name: customer.name || 'Customer',
          phone: customer.phone || 'N/A',
          address: customer.address || { area: '', city: '' }
        },
        commission: commission,
        commissionRate: 0.10,
        commissionStatus: 'pending',
        source: 'referral'
      };
    }
    else {
      return NextResponse.json(
        { success: false, error: 'Missing customer or seller information' },
        { status: 400 }
      );
    }
    
    // Create the order
    const order = await Order.create(orderData);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully!',
      order: {
        _id: order._id.toString(),
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        source: order.source
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}