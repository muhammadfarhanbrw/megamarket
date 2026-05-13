// app/api/products/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import FactoryRate from "../../models/FactoryRate";

// FIXED: saveImage function that actually works
// REPLACE your entire saveImage function with this one
const saveImage = async (image) => {
  // If no image provided
  if (!image) {
    console.log('❌ No image provided');
    return '';
  }
  
  // If image is already a string (URL or existing Base64)
  if (typeof image === 'string') {
    console.log('📷 Image is already a string');
    return image;
  }
  
  // Convert file to Base64 (NOT saving to filesystem)
  try {
    console.log('📷 Converting image to Base64:', image.name, image.size, 'bytes');
    
    // Read the file as ArrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = image.type || 'image/jpeg';
    
    // Return as data URL - this gets stored in MongoDB, NOT on filesystem
    const dataUrl = `data:${mimeType};base64,${base64}`;
    console.log(`✅ Image converted to Base64, length: ${dataUrl.length}`);
    
    return dataUrl;
    
  } catch (error) {
    console.error('❌ Error converting image:', error);
    return '';
  }
};

// Helper function to sync product to factory rates WITH IMAGE
const syncToFactoryRates = async (product) => {
  try {
    console.log(`🔄 Syncing product to factory rates: ${product.name}`);
    console.log(`   - Image URL: ${product.image ? 'Yes (Base64)' : 'NO IMAGE'}`);
    console.log(`   - Factory Price: ${product.factoryPrice}`);
    console.log(`   - Selling Price: ${product.price}`);
    
    // Only sync if factory price exists and is greater than 0
    if (!product.factoryPrice || product.factoryPrice <= 0) {
      console.log(`⚠️ No factory price for ${product.name}, skipping factory rate sync`);
      return;
    }
    
    // Get the image URL from the product
    const imageUrl = product.image && product.image !== 'pending' ? product.image : '';
    
    // Check if factory rate already exists for this product
    const existingRate = await FactoryRate.findOne({ productName: product.name });
    
    if (existingRate) {
      // Update existing rate - INCLUDES IMAGE
      existingRate.factoryPrice = product.factoryPrice;
      existingRate.sellingPrice = product.price;
      existingRate.category = product.categories;
      existingRate.supplier = product.sellerId || 'Admin';
      existingRate.imageUrl = imageUrl;
      existingRate.updatedAt = new Date();
      await existingRate.save();
      console.log(`✅ UPDATED factory rate for ${product.name}`);
    } else {
      // Create new factory rate - INCLUDES IMAGE
      const newRate = await FactoryRate.create({
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
    
    // Verify the image was saved
    const verifyRate = await FactoryRate.findOne({ productName: product.name });
    console.log(`🔍 Verification - ${product.name}: imageUrl = ${verifyRate?.imageUrl ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.error('Error syncing to factory rates:', error);
  }
};

// Helper function to remove from factory rates
const removeFromFactoryRates = async (productName, productId) => {
  try {
    let deleted = false;
    
    const resultByName = await FactoryRate.deleteOne({ productName: productName });
    if (resultByName.deletedCount > 0) {
      console.log(`✅ Removed factory rate by product name: ${productName}`);
      deleted = true;
    }
    
    if (productId) {
      const resultByProductId = await FactoryRate.deleteOne({ productId: productId });
      if (resultByProductId.deletedCount > 0) {
        console.log(`✅ Removed factory rate by product ID: ${productId}`);
        deleted = true;
      }
    }
    
    const resultCaseInsensitive = await FactoryRate.deleteOne({ 
      productName: { $regex: new RegExp(`^${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });
    if (resultCaseInsensitive.deletedCount > 0) {
      console.log(`✅ Removed factory rate by case-insensitive name: ${productName}`);
      deleted = true;
    }
    
    if (!deleted) {
      console.log(`⚠️ No factory rate found for product: ${productName}`);
    }
    
    return deleted;
  } catch (error) {
    console.error('Error removing from factory rates:', error);
    return false;
  }
};

// GET products (with filters)
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
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, product },
        { status: 200 }
      );
    }
    
    let filter = {};
    if (category) filter.categories = category;
    if (status) filter.status = status;
    if (source) filter.source = source;
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    const categories = await Product.distinct('categories');
    
    return NextResponse.json(
      { 
        success: true, 
        products,
        categories: categories.filter(c => c && c.trim() !== '')
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
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
    
    console.log("📦 Creating product:", { 
      name, 
      sellerId, 
      price, 
      factoryPrice, 
      categories, 
      source,
      hasImage: !!image,
      imageType: image ? typeof image : 'none',
      imageSize: image && image.size ? image.size : 0
    });
    
    if (!name || !sellerId || !description || !price || !categories) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Save image to Base64
    let imageUrl = '';
    if (image && image.size > 0) {
      imageUrl = await saveImage(image);
      console.log(`🖼️ Image saved, length: ${imageUrl.length}`);
    } else {
      console.log(`⚠️ No image uploaded for product: ${name}`);
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      );
    }
    
    const productStatus = source === 'admin' ? 'approved' : 'pending';
    const productSource = source || 'seller';
    
    // Create product
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
    
    // Sync to factory rates
    if (source === 'admin' || (factoryPrice && Number(factoryPrice) > 0)) {
      await syncToFactoryRates(product);
    }
    
    const message = source === 'admin' 
      ? 'Product created successfully and added to factory rates!'
      : 'Product submitted for admin approval';
    
    return NextResponse.json(
      { 
        success: true, 
        message: message,
        product: product 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT - Update product by ID
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const updateData = {
        status: body.status,
        adminNotes: body.adminNotes || existingProduct.adminNotes,
        updatedAt: new Date()
      };
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
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
        console.log(`New image saved for product: ${name}`);
      }
    } else {
      updateData.image = existingProduct.image;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    await syncToFactoryRates(updatedProduct);
    
    return NextResponse.json({ success: true, product: updatedProduct });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product by ID
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    await removeFromFactoryRates(deletedProduct.name, deletedProduct._id.toString());
    
    return NextResponse.json({ success: true, product: deletedProduct });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}