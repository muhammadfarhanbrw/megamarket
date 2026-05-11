// app/api/slider/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Slider from '../../models/Slider';

// GET - Fetch all sliders
export async function GET() {
  await connectToDatabase();
  const sliders = await Slider.find().sort({ order: 1 });
  return NextResponse.json({ success: true, sliders });
}

// POST - Create slider
export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();
  const slider = await Slider.create(body);
  return NextResponse.json({ success: true, slider });
}

// PUT - Update slider
export async function PUT(request) {
  await connectToDatabase();
  const { _id, ...data } = await request.json();
  const slider = await Slider.findByIdAndUpdate(_id, data, { new: true });
  return NextResponse.json({ success: true, slider });
}

// DELETE - Delete slider
export async function DELETE(request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await Slider.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}