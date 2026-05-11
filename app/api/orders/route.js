// import { NextResponse } from 'next/server';
// import connectToDatabase from "../../lib/mongodb";
// import Order from "../../models/Order";
// import Notification from "../../models/Notification";

// // GET - Fetch all orders
// export async function GET(request) {
//   try {
//     await connectToDatabase();
    
//     const { searchParams } = new URL(request.url);
//     const status = searchParams.get('status');
//     const newOnly = searchParams.get('new');
    
//     let filter = {};
//     if (status) {
//       filter.status = status;
//     }
//     if (newOnly) {
//       filter.status = 'pending';
//     }
    
//     const orders = await Order.find(filter).sort({ createdAt: -1 });
    
//     // Serialize orders for response
//     const serializedOrders = orders.map(order => ({
//       ...order.toObject(),
//       _id: order._id.toString(),
//       createdAt: order.createdAt?.toISOString(),
//       updatedAt: order.updatedAt?.toISOString(),
//     }));
    
//     return NextResponse.json(
//       { 
//         success: true, 
//         orders: serializedOrders,
//         newOrders: newOnly ? serializedOrders.filter(o => o.status === 'pending') : []
//       },
//       { status: 200 }
//     );
    
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to generate unique order ID
// async function generateOrderId() {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const dateStr = `${year}${month}${day}`;
  
//   // Count orders created today
//   const startOfDay = new Date();
//   startOfDay.setHours(0, 0, 0, 0);
//   const endOfDay = new Date();
//   endOfDay.setHours(23, 59, 59, 999);
  
//   const todayOrders = await Order.countDocuments({
//     createdAt: { $gte: startOfDay, $lte: endOfDay }
//   });
  
//   const sequence = String(todayOrders + 1).padStart(4, '0');
//   return `ORD-${dateStr}-${sequence}`;
// }

// // POST - Create new order
// export async function POST(request) {
//   try {
//     await connectToDatabase();
    
//     const body = await request.json();
//     const { cart, total, customerInfo } = body;
    
//     // Validation
//     if (!cart || !total || !customerInfo) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }
    
//     if (!customerInfo.name || !customerInfo.phone) {
//       return NextResponse.json(
//         { error: 'Customer name and phone are required' },
//         { status: 400 }
//       );
//     }
    
//     // Generate unique order ID
//     const orderId = await generateOrderId();
    
//     // Create order with proper orderId
//     const order = await Order.create({
//       orderId: orderId,  // This is important for tracking!
//       customer: {
//         name: customerInfo.name.trim(),
//         phone: customerInfo.phone.trim(),
//         email: customerInfo.email ? customerInfo.email.trim() : '',
//         address: customerInfo.address || {}
//       },
//       customerInfo: {
//         name: customerInfo.name.trim(),
//         phone: customerInfo.phone.trim(),
//         email: customerInfo.email ? customerInfo.email.trim() : '',
//         address: customerInfo.address || {}
//       },
//       items: cart.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: parseFloat(item.price),
//         quantity: item.quantity,
//         image: item.image || '',
//         productPrice: parseFloat(item.price)
//       })),
//       cart: cart.map(item => ({
//         name: item.name,
//         quantity: item.quantity,
//         price: parseFloat(item.price),
//         productPrice: parseFloat(item.price)
//       })),
//       totalAmount: parseFloat(total),
//       total: parseFloat(total),
//       status: 'pending',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
    
//     // Create notification for admin (with error handling)
//     try {
//       if (Notification && typeof Notification.create === 'function') {
//         await Notification.create({
//           type: 'new_order',
//           title: 'New Order Received!',
//           message: `New order #${orderId} from ${customerInfo.name} - Total: Rs. ${parseFloat(total).toLocaleString()}`,
//           orderId: order._id,
//           isRead: false,
//           priority: 'high',
//           createdAt: new Date(),
//         });
//         console.log('Notification created successfully');
//       } else {
//         console.warn('Notification model not available');
//       }
//     } catch (notifError) {
//       // Don't fail the order if notification fails
//       console.error('Error creating notification:', notifError);
//     }
    
//     // Return success with customer message and orderId for tracking
//     return NextResponse.json(
//       { 
//         success: true, 
//         order: {
//           ...order.toObject(),
//           _id: order._id.toString(),
//           orderId: orderId,
//           createdAt: order.createdAt?.toISOString(),
//         },
//         customerMessage: `Thank you for your order! Your Order ID is: ${orderId}. Please save this ID to track your order. We will call you very soon to confirm the delivery details.`,
//         adminNotified: true,
//         message: 'Order placed successfully',
//         trackingId: orderId
//       },
//       { status: 201 }
//     );
    
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create order' },
//       { status: 500 }
//     );
//   }
// }
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