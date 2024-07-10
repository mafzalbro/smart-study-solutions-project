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
  description: { type: String },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: String }],
  slug: { type: String, unique: true },
  answers: [answerSchema]
}, { timestamps: true });

const Question = mongoose.model('Question', qnaSchema);

module.exports = Question;
