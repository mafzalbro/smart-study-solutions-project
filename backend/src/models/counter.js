const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
