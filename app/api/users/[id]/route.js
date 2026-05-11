
// import { NextResponse } from "next/server";
// import connectToDatabase from "../../../lib/mongodb";
// import User from "../../../models/User";

// // DELETE - Delete a user
// export async function DELETE(request, { params }) {
//     try {
//         await connectToDatabase();
//         const { id } = params;
        
//         const user = await User.findByIdAndDelete(id);
        
//         if (!user) {
//             return NextResponse.json(
//                 { success: false, error: 'User not found' },
//                 { status: 404 }
//             );
//         }
        
//         return NextResponse.json({
//             success: true,
//             message: 'User deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// // PATCH - Update user role
// export async function PATCH(request, { params }) {
//     try {
//         await connectToDatabase();
//         const { id } = params;
//         const { role } = await request.json();

//         // Validate role
//         const validRoles = ['user', 'admin', 'seller'];
//         if (!validRoles.includes(role)) {
//             return NextResponse.json(
//                 { success: false, error: 'Invalid role. Must be user, admin, or seller' },
//                 { status: 400 }
//             );
//         }

//         // Find and update user role
//         const user = await User.findByIdAndUpdate(
//             id,
//             { role },
//             { new: true, runValidators: true }
//         ).select('-password');

//         if (!user) {
//             return NextResponse.json(
//                 { success: false, error: 'User not found' },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({
//             success: true,
//             message: 'User role updated successfully',
//             user: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 phone: user.phone,
//                 createdAt: user.createdAt
//             }
//         });
//     } catch (error) {
//         console.error('Error updating user role:', error);
//         return NextResponse.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";

// GET a single user (optional - for future use)
export async function GET(request, { params }) {
    try {
        // IMPORTANT: Await params in Next.js 15
        const { id } = await params;
        
        await connectToDatabase();
        
        // Validate ID format
        if (!id || id.length !== 24) {
            return NextResponse.json(
                { success: false, error: "Invalid user ID format" },
                { status: 400 }
            );
        }
        
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PATCH - Update user role
export async function PATCH(request, { params }) {
    try {
        // IMPORTANT: Await params in Next.js 15
        const { id } = await params;
        
        const body = await request.json();
        const { role } = body;
        
        await connectToDatabase();
        
        // Validate role
        const validRoles = ['user', 'admin', 'seller'];
        if (!role || !validRoles.includes(role)) {
            return NextResponse.json(
                { success: false, error: "Invalid role. Must be user, admin, or seller" },
                { status: 400 }
            );
        }
        
        // Validate ID format (MongoDB ObjectId is 24 characters)
        if (!id || id.length !== 24) {
            return NextResponse.json(
                { success: false, error: "Invalid user ID format" },
                { status: 400 }
            );
        }
        
        // Find and update user role
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                role: role,
                updatedAt: new Date()
            },
            { 
                new: true,  // Return the updated document
                runValidators: true 
            }
        ).select('-password');
        
        if (!updatedUser) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            user: updatedUser,
            message: "User role updated successfully"
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Remove a user
export async function DELETE(request, { params }) {
    try {
        // IMPORTANT: Await params in Next.js 15
        const { id } = await params;
        
        await connectToDatabase();
        
        // Validate ID format
        if (!id || id.length !== 24) {
            return NextResponse.json(
                { success: false, error: "Invalid user ID format" },
                { status: 400 }
            );
        }
        
        // Optional: Prevent deleting your own admin account
        // You can add authentication logic here to check which user is making the request
        
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}