// app/api/users/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/mongodb";
import User from "../../models/User";

export async function GET() {
    try {
        await connectToDatabase();
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        // Calculate stats
        const stats = {
            total: users.length,
            admin: users.filter(u => u.role === 'admin').length,
            user: users.filter(u => u.role === 'user').length,
            seller: users.filter(u => u.role === 'seller').length
        };
        
        return NextResponse.json({
            success: true,
            users: users,
            stats: stats
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}