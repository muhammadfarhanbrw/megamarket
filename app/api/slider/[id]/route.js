// app/api/slider/[id]/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Slider from '../../../models/Slider';

// PUT - Update slider
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();
    
    const slider = await Slider.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!slider) {
      return NextResponse.json(
        { success: false, error: 'Slider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      slider: slider,
    });
  } catch (error) {
    console.error('Error updating slider:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const slider = await Slider.findByIdAndDelete(id);
    
    if (!slider) {
      return NextResponse.json(
        { success: false, error: 'Slider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Slider deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting slider:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}