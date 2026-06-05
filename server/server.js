import "./config/env.js";  // MUST be first
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes  from "./routes/authRoutes.js";
import aiRoutes    from "./routes/aiRoutes.js";
import userRoutes  from "./routes/user.js";
import chatRoutes  from "./routes/chats.js";

connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Neroxa AI API running...");
});

// Register routes
app.use("/api/auth",  authRoutes);
app.use("/api/ai",    aiRoutes);
app.use("/api/user",  userRoutes);
app.use("/api/chats", chatRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});