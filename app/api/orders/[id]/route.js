// app/api/orders/[id]/route.js - Complete updated version
import { NextResponse } from 'next/server';
import connectToDatabase from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";

// GET - Get single order
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const serializedOrder = {
      ...order.toObject(),
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    };
    
    return NextResponse.json(
      { success: true, order: serializedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status (with profit calculation for delivered)
export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { status, commissionStatus, totalFactoryCost, actualProfit, profitMargin } = body;
    
    const updateData = { updatedAt: new Date() };
    
    // Update order status
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        );
      }
      updateData.status = status;
      
      // If marking as delivered, calculate factory cost and profit
      if (status === 'delivered') {
        // Get the order first
        const order = await Order.findById(id);
        
        if (order && order.items) {
          let totalFactoryCostCalc = 0;
          
          // Calculate factory cost for each item
          for (const item of order.items) {
            let factoryPrice = item.factoryPrice;
            
            // If factory price not in item, fetch from product
            if (!factoryPrice && item.id) {
              try {
                const product = await Product.findById(item.id);
                if (product && product.factoryPrice) {
                  factoryPrice = product.factoryPrice;
                } else {
                  factoryPrice = item.price || 0;
                }
              } catch (err) {
                console.error("Error fetching product:", err);
                factoryPrice = item.price || 0;
              }
            }
            
            factoryPrice = factoryPrice || item.price || 0;
            totalFactoryCostCalc += factoryPrice * (item.quantity || 1);
          }
          
          const actualProfitCalc = (order.totalAmount || 0) - totalFactoryCostCalc;
          const profitMarginCalc = totalFactoryCostCalc > 0 ? (actualProfitCalc / totalFactoryCostCalc * 100) : 0;
          
          updateData.totalFactoryCost = totalFactoryCostCalc;
          updateData.actualProfit = actualProfitCalc;
          updateData.profitMargin = profitMarginCalc;
          
          console.log("Profit calculation:", {
            totalFactoryCost: totalFactoryCostCalc,
            actualProfit: actualProfitCalc,
            profitMargin: profitMarginCalc
          });
        } else if (totalFactoryCost !== undefined) {
          // Use provided values if available
          updateData.totalFactoryCost = totalFactoryCost;
          updateData.actualProfit = actualProfit;
          updateData.profitMargin = profitMargin;
        }
      }
    }
    
    // Update commission status
    if (commissionStatus) {
      const validCommissionStatuses = ['pending', 'paid'];
      if (!validCommissionStatuses.includes(commissionStatus)) {
        return NextResponse.json(
          { error: 'Invalid commission status value' },
          { status: 400 }
        );
      }
      updateData.commissionStatus = commissionStatus;
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const serializedOrder = {
      ...order.toObject(),
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
    };
    
    let message = '';
    if (status === 'delivered') {
      message = `Order marked as delivered! Profit: ₹${(order.actualProfit || 0).toFixed(2)} (${(order.profitMargin || 0).toFixed(1)}% margin)`;
    } else if (status) {
      message = `Order status updated to ${status}`;
    } else if (commissionStatus) {
      message = `Commission marked as ${commissionStatus}`;
    }
    
    return NextResponse.json(
      { success: true, order: serializedOrder, message },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Order deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}