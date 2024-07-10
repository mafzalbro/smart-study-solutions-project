const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },  
  createdAt: { type: Date, default: Date.now },
});

const answerSchema = new Schema({
  answerText: { type: String, required: true },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reports: [reportSchema],
  createdAt: { type: Date, default: Date.now },
});

const questionSchema = new Schema({
  question: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  slug: { type: String, required: true, unique: true },
  answers: [answerSchema],
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reports: [reportSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
