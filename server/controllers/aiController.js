import Groq from "groq-sdk";
import Usage from "../models/Usage.js";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * CHAT WITH AI
 */
export const chat = async (req, res) => {
  const { prompt, messages } = req.body;

  if (!prompt && !messages) {
    return res.status(400).json({ success: false, message: "prompt is required" });
  }

  const formattedMessages = messages || [{ role: "user", content: prompt }];

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free & fast
      max_tokens: 1024,
      messages: formattedMessages,
    });

    const reply = response.choices[0].message.content;
    const tokensUsed = response.usage?.prompt_tokens + response.usage?.completion_tokens || 0;

    // Save usage to DB
    await Usage.create({
      userId: req.user._id,
      prompt: prompt || formattedMessages[formattedMessages.length - 1].content,
      response: reply,
      tokensUsed,
    });

    return res.json({
      success: true,
      result: reply,
      reply,
      tokensUsed,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET USAGE HISTORY
 */
export const getUsage = async (req, res) => {
  try {
    const usage = await Usage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ success: true, usage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};