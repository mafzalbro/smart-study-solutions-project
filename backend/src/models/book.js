const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  status: { type: Boolean, enum: [true, false], required: true },
  ai_approval: { type: Boolean, default: false, enum: [true, false] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
