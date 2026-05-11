// app/api/categories/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all unique categories from products
    const categories = await Product.distinct('categories');
    
    return NextResponse.json(
      { 
        success: true, 
        categories: categories.filter(cat => cat && cat.trim() !== '')
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}