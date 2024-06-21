const client = require('../config/whatsapp');

const sendMessage = async (to, message) => {
    try {
        const chatId = `${to}@c.us`;
        await client.sendMessage(chatId, message);
        return { success: true, message: 'Message sent' };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

module.exports = { sendMessage };
