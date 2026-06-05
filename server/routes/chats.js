import express from "express";
import { getChats, createChat, updateChat, deleteChat } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import Chat from "../models/Chat.js";

const router = express.Router();

router.get("/",       protect, getChats);
router.post("/",      protect, createChat);
router.put("/:id",    protect, updateChat);   // ✅ NEW
router.delete("/:id", protect, deleteChat);
router.get("/:id",    protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;