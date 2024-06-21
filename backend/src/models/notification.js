const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  reason: { type: String },
  created_at: { type: Date, default: Date.now },
  sent_at: { type: Date }
});

module.exports = mongoose.model('Notification', NotificationSchema);
