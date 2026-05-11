// app/api/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import connectToDatabase from "../../lib/mongodb";
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        await connectToDatabase();
        const { email, password } = await request.json();
        
        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required',
                },
                { status: 400 }
            );
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found. Please sign up first.',
                },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid password. Please try again.',
                },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        // Determine redirect path based on user role
        let redirectPath = '/';
        
        if (user.role === 'admin') {
            redirectPath = '/dashboard';
        } else if (user.role === 'seller') {
            redirectPath = '/seller';  // CHANGED: from '/seller' to '/seller-dashboard'
        } else if (user.role === 'user') {
            redirectPath = '/';
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name || user.username || email.split('@')[0],
                email: user.email,
                role: user.role,
            },
            redirectTo: redirectPath
        }, { status: 200 });

        // Set cookie
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific errors
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Error creating authentication token',
                },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error. Please try again later.',
            },
            { status: 500 }
        );
    }
}