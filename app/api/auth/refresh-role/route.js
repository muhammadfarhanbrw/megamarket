import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (user && user.role !== session.user.role) {
      // Update the session token by creating a new one
      return NextResponse.json({ 
        needsRefresh: true,
        newRole: user.role 
      });
    }
    
    return NextResponse.json({ needsRefresh: false });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}