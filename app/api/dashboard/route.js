
import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';


import {  verifyToken } from '../../lib/auth';

export async function GET(request) {
    try {
        await connectToDatabase();
        const token = request.cookies.get('token')?.value;
        if(!token){
            return NextResponse.json(
                {
                    success:false,
                    message: 'Authentication token missing',
                    status:'unauthorized',
                },
                {status:401},
            )

        }
        const decoded = verifyToken(token);
        if(!decoded || !decoded.userId){
            return NextResponse.json(
                {
                    success:false,
                    message: 'Invalid authentication token',
                    status:'unauthorized',  
                },
                {status:402},
            )
        }
        // finding the user in the database
        const user = await User.findById(decoded.userId)
        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message: 'User not found',
                    status:'unauthorized',  
                },
                {status:403}
            )
        }
        if(user.role !== 'admin'){
            return NextResponse.json(
                {
                    success:false,
                    message: 'this is the user',
                },
                {status:404}
            )
        }
       // In your /api/dashboard/route.js - update the admin response:
if (user.role === 'admin') {
    // Return actual admin dashboard data
    return NextResponse.json({
        success: true,
        welcomeMessage: `Welcome Admin ${user.name || user.email}!`,
        features: [
            'Manage all users',
            'View system analytics',
            'Manage content',
            'Access admin settings',
            // ... other features
        ],
        stats: {
            totalUsers: 156,
            activeUsers: 142,
            newUsersToday: 8,
            // ... other stats
        }
    }, { status: 200 }); // Changed from 405 to 200
}
    } catch (error) {
        return NextResponse.json(
            {
                success:false,
                message: 'Internal server error',
                status:'error',
            },
            {status:500}
        )
    }
}