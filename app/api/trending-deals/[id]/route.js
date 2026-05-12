
// app/api/trending-deals/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import TrendingDeal from '../../../models/TrendingDeal';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deal = await TrendingDeal.findById(id);
    
    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, deal });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const formData = await request.formData();
    const updateData = {};
    
    const title = formData.get('title');
    const description = formData.get('description');
    const discountPercentage = formData.get('discountPercentage');
    const originalPrice = formData.get('originalPrice');
    const dealPrice = formData.get('dealPrice');
    const endDate = formData.get('endDate');
    const productId = formData.get('productId');
    const priority = formData.get('priority');
    const isActive = formData.get('isActive');
    const imageFile = formData.get('image');
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (discountPercentage) updateData.discountPercentage = parseFloat(discountPercentage);
    if (originalPrice) updateData.originalPrice = parseFloat(originalPrice);
    if (dealPrice) updateData.dealPrice = parseFloat(dealPrice);
    if (endDate) updateData.endDate = new Date(endDate);
    if (productId) updateData.productId = productId;
    if (priority) updateData.priority = parseInt(priority);
    if (isActive !== null) updateData.isActive = isActive === 'true';
    
    if (imageFile && imageFile !== 'undefined' && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = imageFile.type;
      updateData.image = `data:${mimeType};base64,${base64}`;
    }
    
    const deal = await TrendingDeal.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, deal });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// FIXED DELETE endpoint - actually deletes from database
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log('🔍 DELETE API called with ID:', id);
    
    if (!id) {
      console.log('❌ No ID provided');
      return NextResponse.json(
        { success: false, error: 'Deal ID is required' },
        { status: 400 }
      );
    }
    
    // First, check if the deal exists
    const existingDeal = await TrendingDeal.findById(id);
    console.log('📦 Existing deal found:', existingDeal ? existingDeal.title : 'NOT FOUND');
    
    if (!existingDeal) {
      console.log('❌ Deal not found in database with ID:', id);
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    // Perform the deletion
    const deletedDeal = await TrendingDeal.findByIdAndDelete(id);
    console.log('🗑️ Deletion result:', deletedDeal ? 'SUCCESS' : 'FAILED');
    
    if (!deletedDeal) {
      console.log('❌ Deletion failed for ID:', id);
      return NextResponse.json(
        { success: false, error: 'Failed to delete deal' },
        { status: 500 }
      );
    }
    
    console.log('✅ Deal deleted successfully:', deletedDeal.title);
    
    // Verify deletion
    const verifyDeletion = await TrendingDeal.findById(id);
    console.log('🔍 Verification - Deal still exists:', verifyDeletion ? 'YES (ERROR!)' : 'NO (Good)');
    
    return NextResponse.json({
      success: true,
      message: 'Deal deleted successfully',
      deletedDeal: {
        id: deletedDeal._id,
        title: deletedDeal.title
      }
    });
    
  } catch (error) {
    console.error('❌ Error in DELETE API:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}