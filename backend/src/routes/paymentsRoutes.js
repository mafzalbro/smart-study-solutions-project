const {
  createJazzCashPayment,
  stripeWebhook,
  createCheckoutSession,
} = require("../controllers/paymentsController");
const express = require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/jazzcash", auth, createJazzCashPayment);

// Route to create a subscription checkout session
router.post("/create-checkout-session", auth, createCheckoutSession);

// Webhook route to handle Stripe events like successful payments
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
