import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          await connectToDatabase();
          
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              password: randomPassword,
              role: "user", // Default role
              googleId: profile.sub,
              emailVerified: true,
              createdAt: new Date()
            });
            console.log("✅ New Google user created:", user.email, "Role:", existingUser.role);
          } else {
            console.log("✅ Existing user found:", user.email, "Role:", existingUser.role);
          }
          
          // IMPORTANT: Pass the role to the user object
          user.role = existingUser.role;
          user.id = existingUser._id.toString();
          
          return true;
        } catch (error) {
          console.error("❌ Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };