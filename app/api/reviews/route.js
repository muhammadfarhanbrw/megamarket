// app/api/reviews/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Review from "../../models/Review";

// GET - Fetch reviews (approved ones for public view)
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    let filter = {};
    
    // Only show approved reviews for public view
    if (approved === 'true') {
      filter.isApproved = true;
    }
    
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Calculate average rating
    const allApproved = await Review.find({ isApproved: true });
    const averageRating = allApproved.length > 0 
      ? allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length 
      : 0;
    
    const ratingDistribution = {
      5: allApproved.filter(r => r.rating === 5).length,
      4: allApproved.filter(r => r.rating === 4).length,
      3: allApproved.filter(r => r.rating === 3).length,
      2: allApproved.filter(r => r.rating === 2).length,
      1: allApproved.filter(r => r.rating === 1).length
    };
    
    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        total: allApproved.length,
        averageRating: averageRating.toFixed(1),
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { customerName, customerEmail, rating, title, comment, orderId } = body;
    
    // Validate
    if (!customerName || !customerEmail || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const review = await Review.create({
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      orderId: orderId || null,
      isApproved: false, // Requires admin approval
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully! It will be visible after admin approval.',
      review
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

// PUT - Update review status (admin only)
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { isApproved } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved, updatedAt: new Date() },
      { new: true }
    );
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      review
    });
    
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review (admin only)
export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}