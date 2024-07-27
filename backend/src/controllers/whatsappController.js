const whatsappService = require('../services/whatsappService');

// Controller function for sending a WhatsApp message
const sendWhatsAppMessage = async (req, res) => {
  const { to, message } = req.body;
  try {
    // Send the WhatsApp message using the WhatsApp service
    const result = await whatsappService.sendMessage(to, message);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, message: 'Error sending WhatsApp message' });
  }
};

module.exports = {
  sendWhatsAppMessage
};
