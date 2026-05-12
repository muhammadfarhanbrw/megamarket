
// app/api/products/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import FactoryRate from "../../models/FactoryRate";

// Helper function to save image
const saveImage = async (image) => {
  if (!image || image.size === 0) return '';
  
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    await mkdir(imagesDir, { recursive: true });
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = path.extname(image.name) || '.jpg';
    const newFileName = `product_${timestamp}_${randomString}${fileExtension}`;
    const filePath = path.join(imagesDir, newFileName);
    
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    if (fs.existsSync(filePath)) {
      return `/images/${newFileName}`;
    } else {
      throw new Error('Failed to save image file');
    }
  } catch (error) {
    console.error('Error saving image:', error);
    return '';
  }
};

// CRITICAL FIX: Helper function to sync product to factory rates WITH IMAGE
const syncToFactoryRates = async (product) => {
  try {
    console.log(`🔄 Syncing product to factory rates: ${product.name}`);
    console.log(`   - Image URL: ${product.image || 'NO IMAGE'}`);
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
      existingRate.imageUrl = imageUrl; // KEY FIX: Add image URL
      existingRate.updatedAt = new Date();
      await existingRate.save();
      console.log(`✅ UPDATED factory rate for ${product.name} with image: ${imageUrl || 'none'}`);
    } else {
      // Create new factory rate - INCLUDES IMAGE
      const newRate = await FactoryRate.create({
        productName: product.name,
        category: product.categories,
        factoryPrice: product.factoryPrice,
        sellingPrice: product.price,
        minOrderQuantity: 1,
        supplier: product.sellerId || 'Admin',
        imageUrl: imageUrl, // KEY FIX: Add image URL
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ CREATED factory rate for ${product.name} with image: ${imageUrl || 'none'}`);
    }
    
    // Verify the image was saved
    const verifyRate = await FactoryRate.findOne({ productName: product.name });
    console.log(`🔍 Verification - ${product.name}: imageUrl = "${verifyRate?.imageUrl}"`);
    
  } catch (error) {
    console.error('Error syncing to factory rates:', error);
  }
};

// UPDATED: Helper function to remove from factory rates - more robust
const removeFromFactoryRates = async (productName, productId) => {
  try {
    let deleted = false;
    
    // Method 1: Delete by productName (exact match)
    const resultByName = await FactoryRate.deleteOne({ productName: productName });
    if (resultByName.deletedCount > 0) {
      console.log(`✅ Removed factory rate by product name: ${productName}`);
      deleted = true;
    }
    
    // Method 2: Delete by productId if you have that field in your FactoryRate model
    if (productId) {
      const resultByProductId = await FactoryRate.deleteOne({ productId: productId });
      if (resultByProductId.deletedCount > 0) {
        console.log(`✅ Removed factory rate by product ID: ${productId}`);
        deleted = true;
      }
    }
    
    // Method 3: Delete by case-insensitive name match
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
    
    // If getting single product by ID
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
    
    // Build filter for multiple products
    let filter = {};
    if (category) {
      filter.categories = category;
    }
    if (status) {
      filter.status = status;
    }
    if (source) {
      filter.source = source;
    }
    
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
    
    console.log("📦 Creating product:", { name, sellerId, price, factoryPrice, categories, source });
    
    if (!name || !sellerId || !description || !price || !categories) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Save image FIRST
    let imageUrl = '';
    if (image && image.size > 0) {
      imageUrl = await saveImage(image);
      console.log(`🖼️ Image saved at: ${imageUrl}`);
    } else {
      console.log(`⚠️ No image uploaded for product: ${name}`);
    }
    
    const productStatus = source === 'admin' ? 'approved' : 'pending';
    const productSource = source || 'seller';
    
    // Create product WITH the image URL
    const product = await Product.create({
      name: name.trim(),
      sellerId: sellerId.trim(),
      description: description.trim(),
      price: Number(price),
      factoryPrice: factoryPrice ? Number(factoryPrice) : 0,
      categories: categories.trim(),
      image: imageUrl, // This is the key!
      status: productStatus,
      source: productSource,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Product created: ${product.name} with image: ${product.image || 'none'}`);
    
    // Sync to factory rates (this will now include the image)
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
    
    console.log("Updating product with ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      console.log("Product not found with ID:", id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if this is a JSON request (status update from admin)
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // This is a status update request from admin
      const body = await request.json();
      
      const updateData = {
        status: body.status,
        adminNotes: body.adminNotes || existingProduct.adminNotes,
        updatedAt: new Date()
      };
      
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      console.log(`Product status updated to ${body.status}:`, updatedProduct.name);
      
      // If approved, sync to factory rates
      if (body.status === 'approved') {
        await syncToFactoryRates(updatedProduct);
      }
      
      return NextResponse.json(
        { 
          success: true, 
          message: `Product ${body.status === 'approved' ? 'approved' : 'rejected'} successfully`,
          product: updatedProduct
        },
        { status: 200 }
      );
    }
    
    // Get form data for regular product update
    const formData = await request.formData();
    const name = formData.get('name');
    const sellerId = formData.get('sellerId');
    const description = formData.get('description');
    const price = formData.get('price');
    const factoryPrice = formData.get('factoryPrice');
    const categories = formData.get('categories');
    const image = formData.get('image');
    
    // Prepare update data
    const updateData = {
      name: name?.trim(),
      sellerId: sellerId?.trim(),
      description: description?.trim(),
      price: price ? Number(price) : existingProduct.price,
      factoryPrice: factoryPrice ? Number(factoryPrice) : existingProduct.factoryPrice || 0,
      categories: categories?.trim() || existingProduct.categories,
      status: 'pending', // Reset to pending when edited
      adminNotes: '', // Clear rejection notes when resubmitted
      updatedAt: new Date()
    };
    
    // Handle image update if new image provided
    if (image && image.size > 0) {
      // Delete old image
      if (existingProduct.image && existingProduct.image !== 'pending') {
        const oldImagePath = path.join(process.cwd(), 'public', existingProduct.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
            console.log(`Deleted old image: ${existingProduct.image}`);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      
      // Save new image
      const imageUrl = await saveImage(image);
      if (imageUrl) {
        updateData.image = imageUrl;
        console.log(`New image saved: ${imageUrl}`);
      }
    } else {
      // Keep existing image
      updateData.image = existingProduct.image;
    }
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log(`Product updated: ${updatedProduct.name} with image: ${updatedProduct.image || 'none'}`);
    
    // Sync to factory rates
    await syncToFactoryRates(updatedProduct);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Product updated and submitted for admin approval. Factory rate synced.',
        product: updatedProduct
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

// UPDATED DELETE product by ID - Now properly removes factory rates
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    console.log("🗑️ Deleting product with ID:", id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // First, get the product to know its name and ID
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    console.log(`📦 Product deleted: ${deletedProduct.name}`);
    console.log(`   - Product ID: ${deletedProduct._id}`);
    console.log(`   - Factory Price: ${deletedProduct.factoryPrice}`);
    
    // REMOVE FROM FACTORY RATES - Using the improved function
    await removeFromFactoryRates(deletedProduct.name, deletedProduct._id.toString());
    
    // Delete image file if it exists
    if (deletedProduct.image && deletedProduct.image !== 'pending') {
      const imagePath = path.join(process.cwd(), 'public', deletedProduct.image);
      try {
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
          console.log(`🗑️ Deleted image: ${deletedProduct.image}`);
        }
      } catch (fileError) {
        console.error('Error deleting image:', fileError);
      }
    }
    
    console.log(`✅ Product and associated factory rate deleted successfully: ${deletedProduct.name}`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Product and associated factory rate deleted successfully',
        product: deletedProduct
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}