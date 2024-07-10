const Question = require('../models/qna');
const Category = require('../models/category');
const User = require('../models/user');
const slugify = require('slugify');
const { paginateResults } = require('../utils/pagination');

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
  const { slug } = req.params;
  const { answerText } = req.body;
  try {
    const question = await Question.findOne({ slug });
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
  const { page = 1, limit = 10, sortBy, filterBy, query } = req.query;
  
  let queryOptions = {};
  let sortOptions = {};

  try {
    // Parse sorting options
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      sortOptions[field] = direction === 'desc' ? -1 : 1;
    }

    // Parse filtering options
    if (filterBy) {
      try {
        const filter = JSON.parse(filterBy);
        Object.assign(queryOptions, filter);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid filterBy parameter' });
      }
    }

    // Parse search query
    if (query) {
      queryOptions.$or = [
        { question: { $regex: query, $options: 'i' } },
      ];
    }

    // Fetch results with pagination and sorting, populating askedBy and category fields
    const questions = await paginateResults(
      Question.find(queryOptions)
        .populate({
          path: 'askedBy',
          select: 'username slug _id',
        })
        .populate({
          path: 'category',
          select: 'name _id',
        }),
      parseInt(page),
      parseInt(limit),
      sortOptions
    );

    // Modify questions data to include the required fields
    const formattedQuestions = questions.data.map(question => ({
      _id: question._id,
      slug: question.slug,
      question: question.question,
      askedBy: {
        _id: question.askedBy._id,
        username: question.askedBy.username,
        slug: question.askedBy.slug,
      },
      category: {
        name: question.category.name,
        _id: question.category._id,
      },
    }));

    res.status(200).json({ totalResults: questions.totalResults, data: formattedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve questions' });
  }
};

// Get a specific question by slug
const getQuestionBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const question = await Question.findOne({ slug })
      .populate('category')
      .populate({
        path: 'askedBy',
        select: 'username role profileImage favoriteGenre'
      })
      .populate({
        path: 'answers.answeredBy',
        select: 'username role profileImage favoriteGenre'
      });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve question' });
  }
};

// Update a question by slug
const updateQuestion = async (req, res) => {
  const { slug } = req.params;
  const { question, category, tags } = req.body;
  try {
    const existingQuestion = await Question.findOne({ slug });
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

// Delete a question by slug
const deleteQuestion = async (req, res) => {
  const { slug } = req.params;
  try {
    const question = await Question.findOneAndDelete({ slug });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

// Update an answer
const updateAnswer = async (req, res) => {
  const { slug, answerId } = req.params;

  const { answerText } = req.body;
  try {
    const question = await Question.findOne({ slug });
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
  const { slug, answerId } = req.params;
  try {
    const question = await Question.findOne({ slug });
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

// Function to get all questions by userSlug
const getUserQuestions = async (req, res) => {
    const { userSlug } = req.params;
    try {
      // Assuming User model has a field 'slug' for userSlug
      const user = await User.findOne({ slug: userSlug }).populate('questions');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user.questions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  };
  
  // Function to get all answers by userSlug
  const getUserAnswers = async (req, res) => {
    const { userSlug } = req.params;
    try {
      // Assuming User model has a field 'slug' for userSlug
      const user = await User.findOne({ slug: userSlug }).populate('answers');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user.answers);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
  };
  

// Get question recommendations for the authenticated user
const getQuestionRecommendations = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Example recommendation logic (can be replaced with your own)
    const recommendations = await Question.find({
      category: { $in: user.favoriteCategories }
    }).limit(10);

    res.status(200).json({ data: recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve recommendations' });
  }
};


// Function to create a category
const createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      
      // Generate slug from name using slugify
      const slug = slugify(name, { lower: true });
  
      // Create new category object
      const newCategory = new Category({ name, description, slug });
  
      // Save new category to database
      await newCategory.save();
  
      // Return successful response with created category
      res.status(201).json(newCategory);
    } catch (err) {
      // Handle any errors
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
    
  // Function to get all categories with pagination, search, filter, and sort
const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, sortBy, filterBy, query } = req.query;

  let queryOptions = {};
  let sortOptions = {};

  try {
    // Parse sorting options
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      sortOptions[field] = direction === 'desc' ? -1 : 1;
    }

    // Parse filtering options
    if (filterBy) {
      try {
        const filter = JSON.parse(filterBy);
        Object.assign(queryOptions, filter);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid filterBy parameter' });
      }
    }

    // Parse search query
    if (query) {
      queryOptions.name = { $regex: query, $options: 'i' };
    }

    // Fetch results with pagination and sorting
    const categories = await paginateResults(
      Category.find(queryOptions),
      parseInt(page),
      parseInt(limit),
      sortOptions
    );

    res.status(200).json({ totalResults: categories.totalResults, data: categories.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};


  // Function to get a category by slug
const getCategoryBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
      const category = await Category.findOne({ slug: slug });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };

  
  // Function to update a category by slug
  const updateCategoryBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
      const updatedCategory = await Category.findOneAndUpdate(
        { slug: slug },
        { $set: req.body },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json(updatedCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
  // Function to delete a category by slug
  const deleteCategoryBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
      const deletedCategory = await Category.findOneAndDelete({ slug: slug });
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json(deletedCategory);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  };

module.exports = {
  submitQuestion,
  answerQuestion,
  getAllQuestions,
  getQuestionBySlug,
  updateQuestion,
  deleteQuestion,
  updateAnswer,
  deleteAnswer,
  getUserQuestions,
  getUserAnswers,
  getQuestionRecommendations,
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug,

};