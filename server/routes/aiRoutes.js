import express from "express";
import { protect } from "../middleware/auth.js";
import { dynamicLimiter } from "../middleware/rateLimiter.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", protect, dynamicLimiter, async (req, res) => {
  const { prompt, history = [] } = req.body;
  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  try {
    const messages = [
      ...history.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: prompt },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1024,
    });

    const response = completion.choices[0].message.content;
    return res.json({ success: true, result: response });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;