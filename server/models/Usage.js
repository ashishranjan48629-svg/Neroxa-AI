import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  conversationId: { type: String },
  prompt: { type: String },
  response: { type: String },
  tokensUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Usage = mongoose.model("Usage", usageSchema);

export default Usage;