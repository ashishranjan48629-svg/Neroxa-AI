import express from "express";
import { register, login, getProfile, googleAuth } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", (req, res, next) => {
  console.log("Register route hit", req.body);
  next();
}, register);

router.post("/login", login);
router.post("/google", googleAuth);         // ← new
router.get("/profile", protect, getProfile);

export default router;