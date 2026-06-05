import Chat from "../models/Chat.js";

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    return res.json(chats);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createChat = async (req, res) => {
  const { title, prompt, response } = req.body;
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      title: title || prompt.slice(0, 60),
      prompt,
      response,
    });
    return res.status(201).json(chat);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ NEW: append a new message pair to existing chat
export const updateChat = async (req, res) => {
  const { prompt, response } = req.body;
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $push: { messages: { prompt, response } } },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    return res.json(chat);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    return res.json({ success: true, message: "Chat deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};