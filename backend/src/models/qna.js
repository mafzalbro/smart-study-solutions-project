const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Answer Schema
const answerSchema = new Schema({
  answerText: { type: String, required: true },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answeredAt: { type: Date, default: Date.now }
});

// QnA Schema
const qnaSchema = new Schema({
  question: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [answerSchema]
}, { timestamps: true });

module.exports = mongoose.model('Qna', qnaSchema);
