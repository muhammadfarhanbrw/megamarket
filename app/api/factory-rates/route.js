// app/api/factory-rates/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import FactoryRate from "../../models/FactoryRate";

// GET - Fetch all factory rates
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let filter = {};
    if (category) {
      filter.category = category;
    }
    
    const rates = await FactoryRate.find(filter).sort({ category: 1, productName: 1 });
    
    return NextResponse.json({ 
      success: true, 
      rates: rates 
    });
    
  } catch (error) {
    console.error('Error fetching factory rates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch factory rates' },
      { status: 500 }
    );
  }
}

// POST - Create new factory rate
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { productName, category, factoryPrice, sellingPrice, minOrderQuantity, supplier, imageUrl } = body;
    
    // Validate required fields
    if (!productName || !category || !factoryPrice || !sellingPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const rate = await FactoryRate.create({
      productName,
      category,
      factoryPrice: parseFloat(factoryPrice),
      sellingPrice: parseFloat(sellingPrice),
      minOrderQuantity: minOrderQuantity || 1,
      supplier: supplier || '',
      imageUrl: imageUrl || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Factory rate created successfully',
      rate: rate 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating factory rate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create factory rate' },
      { status: 500 }
    );
  }
}

// PUT - Update factory rate
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // FIX: Check if id is provided and valid
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid or missing ID in PUT request:', id);
      return NextResponse.json(
        { success: false, error: 'Rate ID is required and must be valid' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { productName, category, factoryPrice, sellingPrice, minOrderQuantity, supplier, imageUrl } = body;
    
    // Validate required fields
    if (!productName || !category || !factoryPrice || !sellingPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // FIX: Check if ID is a valid MongoDB ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      console.error('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid rate ID format' },
        { status: 400 }
      );
    }
    
    const rate = await FactoryRate.findByIdAndUpdate(
      id,
      {
        productName,
        category,
        factoryPrice: parseFloat(factoryPrice),
        sellingPrice: parseFloat(sellingPrice),
        minOrderQuantity: minOrderQuantity || 1,
        supplier: supplier || '',
        imageUrl: imageUrl || '',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!rate) {
      return NextResponse.json(
        { success: false, error: 'Factory rate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Factory rate updated successfully',
      rate: rate 
    });
    
  } catch (error) {
    console.error('Error updating factory rate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update factory rate' },
      { status: 500 }
    );
  }
}

// DELETE - Delete factory rate
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // FIX: Check if id is provided and valid
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid or missing ID in DELETE request:', id);
      return NextResponse.json(
        { success: false, error: 'Rate ID is required and must be valid' },
        { status: 400 }
      );
    }
    
    // FIX: Check if ID is a valid MongoDB ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      console.error('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid rate ID format' },
        { status: 400 }
      );
    }
    
    const rate = await FactoryRate.findByIdAndDelete(id);
    
    if (!rate) {
      return NextResponse.json(
        { success: false, error: 'Factory rate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Factory rate deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting factory rate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete factory rate' },
      { status: 500 }
    );
  }
}