const Notification = require('../models/notification'); // Ensure the correct path

const createNotification = async (userId, message, type, reason = null) => {
  try {
    const notification = new Notification({
      user_id: userId,
      message: message,
      type: type,
      reason: reason
    });
    await notification.save();
    console.log('Notification saved:', notification); // Debug log
    return notification;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error;
  }
};

module.exports = { createNotification };
