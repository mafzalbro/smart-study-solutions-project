const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminLogSchema = new Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
