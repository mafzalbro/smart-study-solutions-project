// controllers/whatsappController.js

const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const Message = require("../models/whatsapp"); // Define a Message model for storing messages

let client;
let isAuthenticated = false; // Track if WhatsApp is authenticated

// Initialize WhatsApp client and generate QR code
const generateQRCode = (req, res) => {
  if (!client) {
    client = new Client();

    client.on("qr", (qr) => {
      // Generate the QR code and send it as a response
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          return res.status(500).json({ error: "Failed to generate QR code" });
        }
        // Send QR code and authentication status
        console.log("qrCode generated");
        return res.json({ qrCodeUrl: url, isAuthenticated: isAuthenticated });
      });
    });

    client.on("ready", () => {
      isAuthenticated = true; // Mark client as authenticated
      console.log("WhatsApp client is ready");
    });

    client.on("authenticated", () => {
      isAuthenticated = true; // Mark client as authenticated
      console.log("WhatsApp client authenticated");
      return res.end({ qrCodeUrl: url, isAuthenticated: isAuthenticated });
    });

    client.initialize();
  } else {
    // If the client is already initialized, just send the authentication status
    return res.json({ qrCodeUrl: null, isAuthenticated });
  }
};

// Handle sending messages
const sendMessage = async (req, res) => {
  const { to, message } = req.body;
  
  client.initialize();
  
  if (!isAuthenticated) {
    return res.status(400).json({ error: "WhatsApp not authenticated" });
  }

  let chatId = to.trim();
  if (!chatId.startsWith("+")) {
    chatId = `+${chatId}`;
  }
  chatId = chatId.replace(/[^0-9+]/g, "");
  if (!chatId.endsWith("@c.us")) {
    chatId += "@c.us";
  }

  client.on("message", (msg) => {
    console.log(msg);
    if (msg.body == "!ping") {
      msg.reply("pong");
    }
  });

  try {
    // Retry mechanism in case of session issues
    let attempts = 3;
    while (attempts > 0) {
      try {
        await client.sendMessage(chatId, message);
        console.log("Message sent successfully");
        return res.status(200).json({ success: true, message: "Message sent" });
      } catch (error) {
        if (error.message.includes("WidFactory")) {
          console.warn(
            "Retry due to WidFactory error. Attempts left:",
            attempts - 1
          );
          attempts--;
        } else {
          throw error; // Other errors should not be retried
        }
      }
    }
    res.status(500).json({ error: "Failed to send message after retries" });
  } catch (error) {
    console.error("Failed to send message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = { generateQRCode, sendMessage };
