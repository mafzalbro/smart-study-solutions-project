const axios = require("axios");
const crypto = require("crypto");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");

exports.createCheckoutSession = async (req, res) => {
  const userId = req.user.id;

  try {
    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a Checkout Session with the PKR subscription plan
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // Use the actual Price ID created for 1000 PKR subscription
          price: "price_1QJLl7FTITJJ7AXfPAwIz02X", // Replace with your PKR Price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.FRONTEND_ORIGIN}/pricing?type=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_ORIGIN}/pricing?type=cancel`,
      metadata: { userId },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};

exports.stripeWebhook = async (req, res) => {
  console.log("Webhook received:", req.body); // Log request body

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata.userId;

        // Update user's subscription status in the database
        await User.findByIdAndUpdate(userId, {
          isMember: true,
          subscriptionStartDate: new Date(), // Set the current date for the subscription start
          subscriptionEndDate: new Date(
            session.subscription.current_period_end * 1000
          ), // Set the subscription end date from Stripe's period end timestamp
        });
        console.log("User subscription successful:", userId);
        break;

      case "customer.subscription.deleted":
        const deletedUser = await User.findByIdAndUpdate(
          event.data.object.metadata.userId,
          {
            isMember: false,
            subscriptionEndDate: new Date(), // Set the current date when subscription is deleted
          },
          { new: true }
        );
        console.log("User subscription cancelled:", deletedUser);
        break;

      // You can add more event types here as necessary
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send("Event received");
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};

exports.createJazzCashPayment = async (req, res) => {
  const { amount, description, paymentMethod, customerMobile } = req.body;

  try {
    const merchantId = process.env.JAZZCASH_MERCHANT_ID;
    const password = process.env.JAZZCASH_PASSWORD;
    const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;
    const returnUrl = process.env.JAZZCASH_RETURN_URL;

    const txnRefNo = Date.now();
    const txnDateTime = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);
    const expiryDateTime = new Date(Date.now() + 10 * 60000)
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    // Select the payment method type for JazzCash
    let pp_TxnType;
    switch (paymentMethod) {
      case "Bank":
        pp_TxnType = "BANKACCOUNT";
        break;
      case "Easypaisa":
        pp_TxnType = "MWALLET";
        break;
      case "UPaisa":
        pp_TxnType = "MWALLET";
        break;
      default:
        pp_TxnType = "MWALLET"; // Default to JazzCash Wallet
        break;
    }

    const hashString = `${integritySalt}&${
      amount * 100
    }&${txnDateTime}&${expiryDateTime}&${merchantId}&${txnRefNo}`;
    const secureHash = crypto
      .createHash("sha256")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    const paymentResponse = await axios.post(process.env.JAZZCASH_API_URL, {
      pp_Version: "1.1",
      pp_TxnType,
      pp_Language: "EN",
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amount * 100, // Amount in paisa
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: "billRef",
      pp_Description: description,
      pp_SecureHash: secureHash,
      pp_MobileNumber: customerMobile,
      pp_ReturnURL: returnUrl,
      pp_ExpiryDateTime: expiryDateTime,
    });

    if (paymentResponse.data.pp_ResponseCode === "000") {
      return res.status(200).json({
        success: true,
        paymentUrl: paymentResponse.data.pp_PaymentURL,
      });
    } else {
      throw new Error(paymentResponse.data.pp_ResponseMessage);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
