import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb';
import TrendingDeal from '../../models/TrendingDeal';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let query = {};
    if (activeOnly) {
      query = {
        isActive: true,
        endDate: { $gt: new Date() }
      };
    }
    
    const deals = await TrendingDeal.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate('productId', 'name price image');
    
    return NextResponse.json({
      success: true,
      deals: deals
    });
  } catch (error) {
    console.error('Error fetching trending deals:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    const title = formData.get('title');
    const description = formData.get('description');
    const discountPercentage = parseFloat(formData.get('discountPercentage'));
    const originalPrice = parseFloat(formData.get('originalPrice'));
    const dealPrice = parseFloat(formData.get('dealPrice'));
    const endDate = new Date(formData.get('endDate'));
    const productId = formData.get('productId') || null;
    const priority = parseInt(formData.get('priority')) || 0;
    const imageFile = formData.get('image');
    
    if (!title || !description || !discountPercentage || !originalPrice || !dealPrice || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let imageUrl = '';
    
    if (imageFile && imageFile !== 'undefined') {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = imageFile.type;
      imageUrl = `data:${mimeType};base64,${base64}`;
    } else {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }
    
    const deal = await TrendingDeal.create({
      title,
      description,
      image: imageUrl,
      discountPercentage,
      originalPrice,
      dealPrice,
      endDate,
      productId,
      priority,
      isActive: true
    });
    
    return NextResponse.json({
      success: true,
      deal: deal
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating trending deal:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}