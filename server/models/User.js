import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String }, // optional for Google users
  googleAuth: { type: Boolean, default: false },
  username:   { type: String, default: "" },
  plan:       { type: String, enum: ["free", "pro", "max"], default: "free" },
  settings: {
    theme:              { type: String, default: "Dark" },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications:  { type: Boolean, default: true },
    twoFactor:          { type: Boolean, default: false },
    activityLog:        { type: Boolean, default: true },
  },
}, { timestamps: true });

// Hash password before save (only if password exists)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);