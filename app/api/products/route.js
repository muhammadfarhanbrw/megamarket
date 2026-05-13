// app/api/products/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import FactoryRate from "../../models/FactoryRate";

// ONLY THIS FUNCTION MATTERS - Converts image to Base64 (NO file writing)
const saveImage = async (image) => {
  // No image provided
  if (!image) {
    console.log('No image provided');
    return '';
  }
  
  // If it's already a string (existing URL or Base64)
  if (typeof image === 'string') {
    return image;
  }
  
  // Convert file to Base64
  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = image.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    console.log('Image converted to Base64, length:', dataUrl.length);
    return dataUrl;
  } catch (error) {
    console.error('Error converting image:', error);
    return '';
  }
};

// Helper function to sync product to factory rates
const syncToFactoryRates = async (product) => {
  try {
    console.log(`🔄 Syncing product to factory rates: ${product.name}`);
    
    if (!product.factoryPrice || product.factoryPrice <= 0) {
      console.log(`⚠️ No factory price for ${product.name}, skipping factory rate sync`);
      return;
    }
    
    const imageUrl = product.image && product.image !== 'pending' ? product.image : '';
    const existingRate = await FactoryRate.findOne({ productName: product.name });
    
    if (existingRate) {
      existingRate.factoryPrice = product.factoryPrice;
      existingRate.sellingPrice = product.price;
      existingRate.category = product.categories;
      existingRate.supplier = product.sellerId || 'Admin';
      existingRate.imageUrl = imageUrl;
      existingRate.updatedAt = new Date();
      await existingRate.save();
      console.log(`✅ UPDATED factory rate for ${product.name}`);
    } else {
      await FactoryRate.create({
        productName: product.name,
        category: product.categories,
        factoryPrice: product.factoryPrice,
        sellingPrice: product.price,
        minOrderQuantity: 1,
        supplier: product.sellerId || 'Admin',
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ CREATED factory rate for ${product.name}`);
    }
  } catch (error) {
    console.error('Error syncing to factory rates:', error);
  }
};

// Helper function to remove from factory rates
const removeFromFactoryRates = async (productName, productId) => {
  try {
    const resultByName = await FactoryRate.deleteOne({ productName: productName });
    if (resultByName.deletedCount > 0) {
      console.log(`✅ Removed factory rate by product name: ${productName}`);
    }
    
    if (productId) {
      await FactoryRate.deleteOne({ productId: productId });
    }
  } catch (error) {
    console.error('Error removing from factory rates:', error);
  }
};

// GET products
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const id = searchParams.get('id');
    
    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product }, { status: 200 });
    }
    
    let filter = {};
    if (category) filter.categories = category;
    if (status) filter.status = status;
    if (source) filter.source = source;
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    const categories = await Product.distinct('categories');
    
    return NextResponse.json({ 
      success: true, 
      products,
      categories: categories.filter(c => c && c.trim() !== '')
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    
    const name = formData.get('name');
    const sellerId = formData.get('sellerId');
    const description = formData.get('description');
    const price = formData.get('price');
    const factoryPrice = formData.get('factoryPrice');
    const categories = formData.get('categories');
    const image = formData.get('image');
    const source = formData.get('source');
    
    console.log("📦 Creating product:", { name, sellerId, price, factoryPrice, categories, source });
    
    if (!name || !sellerId || !description || !price || !categories) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    // Convert image to Base64 - THIS IS THE KEY FIX
    let imageUrl = '';
    if (image && image.size > 0) {
      imageUrl = await saveImage(image);
      console.log(`🖼️ Image converted to Base64, length: ${imageUrl.length}`);
    } else {
      return NextResponse.json({ error: 'Product image is required' }, { status: 400 });
    }
    
    const productStatus = source === 'admin' ? 'approved' : 'pending';
    const productSource = source || 'seller';
    
    const product = await Product.create({
      name: name.trim(),
      sellerId: sellerId.trim(),
      description: description.trim(),
      price: Number(price),
      factoryPrice: factoryPrice ? Number(factoryPrice) : 0,
      categories: categories.trim(),
      image: imageUrl,
      status: productStatus,
      source: productSource,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Product created: ${product.name}`);
    
    if (source === 'admin' || (factoryPrice && Number(factoryPrice) > 0)) {
      await syncToFactoryRates(product);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product: product 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const updatedProduct = await Product.findByIdAndUpdate(id, {
        status: body.status,
        adminNotes: body.adminNotes || existingProduct.adminNotes,
        updatedAt: new Date()
      }, { new: true });
      
      if (body.status === 'approved') {
        await syncToFactoryRates(updatedProduct);
      }
      return NextResponse.json({ success: true, product: updatedProduct });
    }
    
    const formData = await request.formData();
    const name = formData.get('name');
    const sellerId = formData.get('sellerId');
    const description = formData.get('description');
    const price = formData.get('price');
    const factoryPrice = formData.get('factoryPrice');
    const categories = formData.get('categories');
    const image = formData.get('image');
    
    const updateData = {
      name: name?.trim(),
      sellerId: sellerId?.trim(),
      description: description?.trim(),
      price: price ? Number(price) : existingProduct.price,
      factoryPrice: factoryPrice ? Number(factoryPrice) : existingProduct.factoryPrice || 0,
      categories: categories?.trim() || existingProduct.categories,
      status: 'pending',
      adminNotes: '',
      updatedAt: new Date()
    };
    
    if (image && image.size > 0) {
      const imageUrl = await saveImage(image);
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    } else {
      updateData.image = existingProduct.image;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    await syncToFactoryRates(updatedProduct);
    
    return NextResponse.json({ success: true, product: updatedProduct });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    await removeFromFactoryRates(deletedProduct.name, deletedProduct._id.toString());
    
    return NextResponse.json({ success: true, product: deletedProduct });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}