
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "user",
  },
  googleId: { type: String, sparse: true }, // ← This is important
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  
  // Your other existing fields
  referralCode: { type: String, unique: true, sparse: true },
  totalCommission: { type: Number, default: 0 },
  pendingCommission: { type: Number, default: 0 },
  paidCommission: { type: Number, default: 0 },
  referredCustomers: [{ type: String, default: [] }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);