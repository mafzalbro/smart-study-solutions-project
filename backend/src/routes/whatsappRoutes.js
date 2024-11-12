const express = require("express");
const router = express.Router();
const {
  generateQRCode,
  sendMessage,
} = require("../controllers/whatsappController");

// Route to generate QR code for WhatsApp authentication
router.get("/generate-qr", generateQRCode);

// Route to send a message to a WhatsApp number
router.post("/send-message", sendMessage);

module.exports = router;
