const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  names: { type: [String], required: false },
  messages: { type: [String], required: false },
  subscribed: { type: Boolean, default: false },
  known: { type: Boolean, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

module.exports = mongoose.model('Contact', contactSchema);
