import express from "express";
import {
  createCheckout,
  webhook,
  billingPortal,
} from "../controllers/billingController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * Create Stripe checkout session
 */
router.post("/checkout", protect, createCheckout);

/**
 * Stripe webhook (IMPORTANT: raw body required)
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

/**
 * Stripe billing portal
 */
router.post("/portal", protect, billingPortal);

export default router;