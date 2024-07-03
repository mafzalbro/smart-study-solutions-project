const Question = require('../models/qna');
const Category = require('../models/category');
const User = require('../models/user');
const slugify = require('slugify');
const { questionRecommendation } = require('../services/questionRecommendation');


// Submit a question
const submitQuestion = async (req, res) => {
  const { question, category, tags } = req.body;
  try {
    // Check if the question already exists
    const existingQuestion = await Question.findOne({ question });
    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already exists' });
    }

    const newQuestion = new Question({
      question,
      askedBy: req.user.id,
      category,
      tags,
      slug: slugify(question, { lower: true, strict: true })
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
      answerText,
      answeredBy: req.user.id
    };

    question.answers.push(newAnswer);
    await question.save();
    res.status(200).json({ message: 'Question answered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to answer question' });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('category');
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve questions' });
  }
};

// Get a specific question by ID
const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id).populate('category');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve question' });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, category, tags } = req.body;
  try {
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question) {
      existingQuestion.question = question;
      existingQuestion.slug = slugify(question, { lower: true, strict: true });
    }
    if (category) existingQuestion.category = category;
    if (tags) existingQuestion.tags = tags;

    await existingQuestion.save();
    res.status(200).json({ message: 'Question updated successfully', existingQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update question' });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

// // Get all answers for a specific question
// const getQuestionAnswers = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const question = await Question.findById(id);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
//     res.status(200).json(question.answers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to retrieve answers' });
//   }
// };

// Update an answer
const updateAnswer = async (req, res) => {
  const { id, answerId } = req.params;

  const { answerText } = req.body;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    answer.answerText = answerText;
    await question.save();
    res.status(200).json({ message: 'Answer updated successfully', answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update answer' });
  }
};

// Delete an answer
const deleteAnswer = async (req, res) => {
  const { id, answerId } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    question.answers.pull(answerId); // Use pull to remove the subdocument
    await question.save();
    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete answer' });
  }
};


// Get all questions asked by a specific user
const getUserQuestions = async (req, res) => {
  const { userId } = req.params;
  try {
    const questions = await Question.find({ askedBy: userId }).populate('category');
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user questions' });
  }
};

// Get all answers given by a specific user
const getUserAnswers = async (req, res) => {
  const { userId } = req.params;
  try {
    const questions = await Question.find({ 'answers.answeredBy': userId });

    // Create a list of answers with their corresponding question details
    const userAnswers = questions.flatMap(q => 
      q.answers
        .filter(a => a.answeredBy.toString() === userId.toString())
        .map(a => ({
          questionId: q._id,
          question: q.question,
          answerId: a._id,
          answerText: a.answerText,
          answeredAt: a.answeredAt,
          answeredBy: a.answeredBy
        }))
    );

    res.status(200).json(userAnswers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user answers' });
  }
};

// Recommender system to suggest questions based on user's activity
const recommendQuestions = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recommendations = await questionRecommendation(user);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error in recommending questions:', error);
    res.status(500).json({ message: 'Failed to recommend questions', error: error.message });
  }
};


// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve categories' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

module.exports = {
  submitQuestion,
  answerQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  // getQuestionAnswers,
  updateAnswer,
  deleteAnswer,
  getUserQuestions,
  getUserAnswers,
  recommendQuestions,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
