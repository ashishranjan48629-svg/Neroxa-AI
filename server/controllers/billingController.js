import stripe from "../config/stripe.js";
import User from "../models/User.js";

/**
 * CREATE STRIPE CHECKOUT SESSION
 */
export const createCheckout = async (req, res) => {
  const { priceId } = req.body;
  const user = req.user;

  try {
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * STRIPE WEBHOOK
 * Handles subscription updates
 */
export const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Webhook error: ${err.message}`,
    });
  }

  try {
    /**
     * USER SUBSCRIBED (checkout completed)
     */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      await User.findOneAndUpdate(
        { stripeCustomerId: session.customer },
        {
          plan: "pro",
          stripeSubscriptionId: session.subscription,
        }
      );
    }

    /**
     * SUBSCRIPTION CANCELLED
     */
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;

      await User.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          plan: "free",
          stripeSubscriptionId: null,
        }
      );
    }

    return res.json({ received: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * STRIPE BILLING PORTAL
 */
export const billingPortal = async (req, res) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};