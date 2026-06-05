import mongoose from "mongoose";

// ✅ sub-schema for follow-up messages
const messageSchema = new mongoose.Schema({
  prompt:   { type: String, required: true },
  response: { type: String, required: true },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:    { type: String, required: true },
  prompt:   { type: String, required: true },   // first message
  response: { type: String, required: true },   // first response
  messages: [messageSchema],                    // ✅ follow-up messages
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);