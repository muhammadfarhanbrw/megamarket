// app/api/products/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";
import FactoryRate from "../../../(components)/dashboard/components/FactoryRatesTab";

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

// FIXED: Helper function to sync product to factory rates WITH IMAGE
const syncToFactoryRates = async (product) => {
  try {
    console.log(`🔄 Syncing product to factory rates: ${product.name}`);
    console.log(`   - Image URL from product: "${product.image || 'NO IMAGE'}"`);
    console.log(`   - Factory Price: ${product.factoryPrice}`);
    console.log(`   - Selling Price: ${product.price}`);
    
    // Only sync if factory price exists and is greater than 0
    if (!product.factoryPrice || product.factoryPrice <= 0) {
      console.log(`⚠️ No factory price for ${product.name}, skipping factory rate sync`);
      return;
    }
    
    // Get the image URL from the product
    const imageUrl = (product.image && product.image !== 'pending') ? product.image : '';
    
    // Check if factory rate already exists for this product
    const existingRate = await FactoryRate.findOne({ productName: product.name });
    
    if (existingRate) {
      // Update existing rate
      existingRate.factoryPrice = product.factoryPrice;
      existingRate.sellingPrice = product.price;
      existingRate.category = product.categories;
      existingRate.supplier = product.sellerId || 'Admin';
      existingRate.imageUrl = imageUrl;
      existingRate.updatedAt = new Date();
      await existingRate.save();
      console.log(`✅ UPDATED factory rate for ${product.name} with image: "${imageUrl}"`);
    } else {
      // Create new factory rate
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
      console.log(`✅ CREATED factory rate for ${product.name} with image: "${imageUrl}"`);
      console.log(`   - Rate ID: ${newRate._id}`);
    }
    
    // Verify the image was saved
    const verifyRate = await FactoryRate.findOne({ productName: product.name });
    console.log(`🔍 Verification - ${product.name}: imageUrl = "${verifyRate?.imageUrl}"`);
    
  } catch (error) {
    console.error('Error syncing to factory rates:', error);
  }
};

// Helper function to remove from factory rates
const removeFromFactoryRates = async (productName) => {
  try {
    const result = await FactoryRate.deleteOne({ productName: productName });
    if (result.deletedCount > 0) {
      console.log(`Removed factory rate for ${productName}`);
    }
  } catch (error) {
    console.error('Error removing from factory rates:', error);
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
      image: imageUrl,
      status: productStatus,
      source: productSource,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Product created: ${product.name}`);
    console.log(`   - Image: ${product.image || 'none'}`);
    console.log(`   - Factory Price: ${product.factoryPrice}`);
    
    // Sync to factory rates (this will now include the image)
    if (source === 'admin' || (factoryPrice && Number(factoryPrice) > 0)) {
      await syncToFactoryRates(product);
    }
    
    const message = source === 'admin' 
      ? 'Product created successfully and added to factory rates!'
      : 'Product submitted for admin approval';
    
    return NextResponse.json({ success: true, message, product }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

// PUT - Update product by ID
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
      const updateData = {
        status: body.status,
        adminNotes: body.adminNotes || existingProduct.adminNotes,
        updatedAt: new Date()
      };
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (body.status === 'approved') {
        await syncToFactoryRates(updatedProduct);
      }
      return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
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
      if (existingProduct.image && existingProduct.image !== 'pending') {
        const oldImagePath = path.join(process.cwd(), 'public', existingProduct.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      const imageUrl = await saveImage(image);
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    } else {
      updateData.image = existingProduct.image;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    await syncToFactoryRates(updatedProduct);
    
    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product by ID
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
    
    await removeFromFactoryRates(deletedProduct.name);
    
    if (deletedProduct.image && deletedProduct.image !== 'pending') {
      const imagePath = path.join(process.cwd(), 'public', deletedProduct.image);
      try {
        if (fs.existsSync(imagePath)) {
          await fs.promises.unlink(imagePath);
        }
      } catch (fileError) {
        console.error('Error deleting image:', fileError);
      }
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}