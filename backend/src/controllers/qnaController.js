const Question = require('../models/qna');

const submitQuestion = async (req, res) => {
  const { question } = req.body;
  try {
    // Check if the question already exists
    const existingQuestion = await Question.findOne({ question });
    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already exists' });
    }

    const newQuestion = new Question({
      question: question,
      askedBy: req.user.id // Assuming the authenticated user ID is available in req.user
    });
    await newQuestion.save();
    res.status(201).json({ message: 'Question submitted successfully', newQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit question' });
  }
};

// Answer a question
const answerQuestion = async (req, res) => {
  const { id } = req.params;
  const { answerText } = req.body;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check for duplicate answers
    const duplicateAnswer = question.answers.find(
      (answer) => answer.answerText === answerText && answer.answeredBy.toString() === req.user.id.toString()
    );
    if (duplicateAnswer) {
      return res.status(400).json({ message: 'Duplicate answer. This answer has already been submitted.' });
    }

    const newAnswer = {
      answerText: answerText,
      answeredBy: req.user.id // Assuming the authenticated user ID is available in req.user
    };

    question.answers.push(newAnswer);
    await question.save();
    res.status(200).json({ message: 'Question answered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to answer question' });
  }
};

module.exports = {
  submitQuestion,
  answerQuestion
};
