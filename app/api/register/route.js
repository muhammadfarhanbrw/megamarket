// import { NextResponse } from "next/server";
// import bcrypt from 'bcryptjs';
// import connectToDatabase from '../../lib/mongodb';
// import User from '../../models/User';

// export async function POST(request) {
//   try {
//     // 1. Parse request body (add await)
//     const { name, email, password } = await request.json();
    
//     // 2. Validate required fields
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: 'All fields are required' },
//         { status: 400 }
//       );
//     }
    
//     // 3. Validate password length
//     // if (password.length < 6) {
//     //   return NextResponse.json(
//     //     { error: 'Password must be at least 6 characters' },
//     //     { status: 400 }
//     //   );
//     // }
    
//     // 4. Connect to database
//     await connectToDatabase();
    
//     // 5. Check if user already exists (add await)
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists' },
//         { status: 409 }
//       );
//     }
    
//     // 6. Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // 7. Create new user (save is not needed with create())
//     const newUser = await User.create({
//       name,
//       email: email.toLowerCase(), // Store email in lowercase
//       password: hashedPassword,
//       role: 'user' // Add default role
//     });
    
//     console.log('User created successfully:', newUser.email);
    
//     // 8. Return success response (remove password from response)
//     const userResponse = {
//       id: newUser._id,
//       name: newUser.name,
//       email: newUser.email,
//       role: newUser.role,
//       createdAt: newUser.createdAt
//     };
    
//     return NextResponse.json(
//       { 
//         message: 'User registered successfully',
//         user: userResponse
//       },
//       { status: 201 }
//     );
    
//   } catch (error) {
//     console.error('Registration error:', error);
    
//     // 9. Return appropriate error response
//     return NextResponse.json(
//       { 
//         error: error.message || 'Internal server error',
//         details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(request) {
  try {
    console.log("1. API route hit");
    
    // 1. Parse request body
    const body = await request.json();
    console.log("2. Request body:", { ...body, password: "[HIDDEN]" });
    
    const { name, email, password } = body;
    
    // 2. Validate required fields
    if (!name || !email || !password) {
      console.log("3. Validation failed - missing fields");
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // 3. Validate password length
    if (password.length < 6) {
      console.log("3. Validation failed - password too short");
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // 4. Connect to database
    console.log("4. Connecting to database...");
    await connectToDatabase();
    console.log("5. Database connected");
    
    // 5. Check if user already exists
    console.log("6. Checking for existing user...");
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("7. User already exists");
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // 6. Hash password
    console.log("8. Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 7. Create new user
    console.log("9. Creating user...");
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user'
    });
    
    console.log("10. User created successfully:", newUser.email);
    
    // 8. Return success response
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userResponse
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("=== REGISTRATION ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Return detailed error in development
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}