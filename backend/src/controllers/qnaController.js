const Question = require("../models/qna");
const Category = require("../models/category");
const Notification = require("../models/notification");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const { paginateResults } = require("../utils/pagination");

const submitQuestion = async (req, res) => {
  const { question, category, tags } = req.body;
  try {
    // Check if the question already exists
    const existingQuestion = await Question.findOne({ question });
    if (existingQuestion) {
      return res.status(400).json({ message: "Question already exists" });
    }

    // Create new question
    const newQuestion = new Question({
      question,
      askedBy: req?.user?.id,
      category,
      tags,
      slug: slugify(question, { lower: true, strict: true }),
    });
    await newQuestion.save();

    // Create a notification for the user confirming the submission
    await Notification.create({
      user_id: req.user.id,
      message: "Your question was submitted successfully.",
      questionId: newQuestion._id,
      type: "questionSubmitted",
    });

    res
      .status(201)
      .json({ message: "Question submitted successfully", newQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit question" });
  }
};

// Answer a question
const answerQuestion = async (req, res) => {
  const { slug } = req.params;
  const { answerText } = req.body;
  try {
    const question = await Question.findOne({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check for duplicate answers
    const duplicateAnswer = question.answers.find(
      (answer) =>
        answer.answerText === answerText &&
        answer.answeredBy.toString() === req?.user?.id.toString()
    );
    if (duplicateAnswer) {
      return res.status(400).json({
        message: "Duplicate answer. This answer has already been submitted.",
      });
    }

    // Add new answer to question
    const newAnswer = {
      answerText,
      answeredBy: req?.user?.id,
    };

    question.answers.push(newAnswer);
    await question.save();

    // Create a notification for the user who asked the question
    await Notification.create({
      user_id: question.askedBy,
      message: "Your question received a new answer.",
      questionId: question._id,
      type: "answerReceived",
    });

    // Create a notification for the user who asked the question
    await Notification.create({
      user_id: newAnswer.answeredBy,
      message: "New question have been answered.",
      questionId: question._id,
      type: "answerReceived",
    });

    res.status(200).json({ message: "Question answered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to answer question" });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  const { page = 1, limit = 10, sortBy, filterBy, query } = req.query;

  let queryOptions = {};
  let sortOptions = { updatedAt: -1 }; // Default sorting by newest first

  try {
    // Parse sorting options
    if (sortBy) {
      const [field, direction] = sortBy.split(":");
      sortOptions = { [field]: direction === "desc" ? -1 : 1 };
    }

    // Parse filtering options
    if (filterBy) {
      try {
        console.log({ filterBy });
        const filter = JSON.parse(filterBy);
        console.log({ filter });

        Object.assign(queryOptions, filter);
      } catch (error) {
        return res.status(400).json({ message: "Invalid filterBy parameter" });
      }
    }

    // Parse search query
    if (query) {
      queryOptions.$or = [{ question: { $regex: query, $options: "i" } }];
    }

    // Fetch results with pagination and sorting, populating askedBy and category fields
    const questions = await paginateResults(
      Question.find(queryOptions)
        .populate({
          path: "askedBy",
          select: "username slug _id",
        })
        .populate({
          path: "category",
          select: "name _id slug",
        })
        .sort({ updatedAt: -1, ...sortOptions }),
      parseInt(page),
      parseInt(limit)
    );

    // Modify questions data to include the required fields
    const formattedQuestions = questions?.data.map((question) => ({
      _id: question?._id,
      slug: question.slug,
      createdAt: question.createdAt,
      askedBy: question.askedBy,
      question: question.question,
      askedBy: {
        _id: question.askedBy?._id,
        username: question.askedBy?.username,
        slug: question.askedBy?.slug,
      },
      category: {
        name: question.category?.name,
        _id: question.category?._id,
        slug: question.category?.slug,
      },
    }));

    res.status(200).json({
      totalResults: questions?.totalResults,
      data: formattedQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve questions" });
  }
};

// Get a specific question by slug
const getQuestionBySlug = async (req, res) => {
  const { slug } = req.params;

  const token = req.headers.authorization;

  if (token) {
    const trimToken = token.replace("Bearer ", "").trim();
    jwt.verify(trimToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
    });
  }

  try {
    const question = await Question.findOne({ slug })
      .populate("category")
      .populate({
        path: "askedBy",
        select: "username role slug profileImage fullname favoriteGenre",
      })
      .populate({
        path: "answers.answeredBy",
        select: "username role slug profileImage fullname favoriteGenre",
      })
      .populate({
        path: "reports.reportedBy",
        select: "username role slug fullname favoriteGenre",
      });

    if (!question) {
      return res.status(404).json({ message: "This question is not found" });
    }

    // Calculate number of upvotes and downvotes for the question
    const upvotesCount = question.upvotedBy.length;
    const downvotesCount = question.downvotedBy.length;

    // Check if the current user has upvoted or downvoted this question
    const isUpvoted = question.upvotedBy.includes(req?.user?.id);
    const isDownvoted = question.downvotedBy.includes(req?.user?.id);

    // Conditionally filter answers based on user membership status
    const answers = question.answers
      .filter((answer) => {
        // Show answer if the user is a member, or if the answer is by a student, or if the answer is by the current user
        return (
          req.user?.isMember ||
          answer.answeredBy?.role === "student" ||
          answer.answeredBy?._id.toString() === req.user?.id
        );
      })

      .map((answer) => {
        const isAnswerUpvoted = answer.upvotedBy.includes(req?.user?.id);
        const isAnswerDownvoted = answer.downvotedBy.includes(req?.user?.id);

        // Calculate upvotes and downvotes counts for each answer
        const answerUpvotesCount = answer.upvotedBy.length;
        const answerDownvotesCount = answer.downvotedBy.length;

        return {
          ...answer.toJSON(),
          isUpvoted: isAnswerUpvoted,
          isDownvoted: isAnswerDownvoted,
          upvotesCount: answerUpvotesCount,
          downvotesCount: answerDownvotesCount,
        };
      });
    res.status(200).json({
      ...question.toJSON(),
      answers,
      upvotesCount,
      downvotesCount,
      isUpvoted,
      isDownvoted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve the question" });
  }
};

// Update a question by slug
const updateQuestion = async (req, res) => {
  const { slug } = req.params;
  const { question, category, tags } = req.body;
  try {
    const existingQuestion = await Question.findOne({ slug });
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question) {
      existingQuestion.question = question;
      existingQuestion.slug = slugify(question, { lower: true, strict: true });
    }
    if (category) existingQuestion.category = category;
    if (tags) existingQuestion.tags = tags;

    await existingQuestion.save();
    res
      .status(200)
      .json({ message: "Question updated successfully", existingQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update question" });
  }
};

// Delete a question by slug and create a notification
const deleteQuestion = async (req, res) => {
  const { slug } = req.params;

  try {
    const question = await Question.findOneAndDelete({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Create a notification for the user who asked the question
    await Notification.create({
      user_id: question.askedBy,
      message: "Your question was deleted by an admin.",
      questionId: question._id,
      type: "deletedByAdmin",
      reason: "Violation of community guidelines or reported content",
    });

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete question" });
  }
};

// Update an answer
const updateAnswer = async (req, res) => {
  const { slug, answerId } = req.params;

  const { answerText } = req.body;
  try {
    const question = await Question.findOne({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    answer.answerText = answerText;
    await question.save();
    res.status(200).json({ message: "Answer updated successfully", answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update answer" });
  }
};

// Delete an answer and create a notification
const deleteAnswer = async (req, res) => {
  const { slug, answerId } = req.params;

  try {
    const question = await Question.findOne({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    question.answers.pull(answerId); // Remove the answer
    await question.save();

    // Create a notification for the user who provided the answer
    await Notification.create({
      user_id: answer.answeredBy,
      message: "Your answer was deleted by an admin.",
      questionId: question._id,
      type: "deletedByAdmin",
      reason: "Violation of community guidelines or reported content",
    });

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete answer" });
  }
};

// Get question recommendations for the authenticated user
const getQuestionRecommendations = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example recommendation logic (can be replaced with your own)
    const recommendations = await Question.find({
      category: { $in: user.favoriteCategories },
    }).limit(10);

    res.status(200).json({ data: recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve recommendations" });
  }
};

// Upvote a question
const upvoteQuestion = async (req, res) => {
  const { slug } = req.params;
  try {
    const question = await Question.findOne({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Remove user from downvotedBy if they had previously downvoted
    question.downvotedBy = question.downvotedBy.filter(
      (userId) => userId.toString() !== req?.user?.id.toString()
    );

    // Add user to upvotedBy if they haven't already upvoted
    if (!question.upvotedBy.includes(req?.user?.id)) {
      question.upvotedBy.push(req?.user?.id);
    }

    await question.save();

    // Calculate upvotes and downvotes counts
    const upvotesCount = question.upvotedBy.length;
    const downvotesCount = question.downvotedBy.length;

    // Check if current user has upvoted or downvoted this question
    const isUpvoted = question.upvotedBy.includes(req?.user?.id);
    const isDownvoted = question.downvotedBy.includes(req?.user?.id);

    res.status(200).json({
      message: "Question upvoted successfully",
      upvotesCount,
      downvotesCount,
      isUpvoted,
      isDownvoted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upvote question" });
  }
};

// Downvote a question
const downvoteQuestion = async (req, res) => {
  const { slug } = req.params;
  try {
    const question = await Question.findOne({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Remove user from upvotedBy if they had previously upvoted
    question.upvotedBy = question.upvotedBy.filter(
      (userId) => userId.toString() !== req?.user?.id.toString()
    );

    // Add user to downvotedBy if they haven't already downvoted
    if (!question.downvotedBy.includes(req?.user?.id)) {
      question.downvotedBy.push(req?.user?.id);
    }

    await question.save();

    // Calculate upvotes and downvotes counts
    const upvotesCount = question.upvotedBy.length;
    const downvotesCount = question.downvotedBy.length;

    // Check if current user has upvoted or downvoted this question
    const isUpvoted = question.upvotedBy.includes(req?.user?.id);
    const isDownvoted = question.downvotedBy.includes(req?.user?.id);

    res.status(200).json({
      message: "Question downvoted successfully",
      upvotesCount,
      downvotesCount,
      isUpvoted,
      isDownvoted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to downvote question" });
  }
};

// Report a question
const reportQuestion = async (req, res) => {
  const { slug } = req.params;
  const { description } = req.body;
  try {
    const question = await Question.findOne({ slug });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Add report details to the question
    question.reports.push({ reportedBy: req?.user?.id, description });

    // Create a new notification for the report
    const notification = new Notification({
      user_id: req?.user?.id,
      type: "report",
      message: `Question reported: ${description}`,
      questionId: question?._id,
    });

    await question.save();
    await notification.save();
    res.status(200).json({ message: "Question reported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to report question" });
  }
};

const upvoteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Remove user from downvotedBy if they had previously downvoted
    answer.downvotedBy = answer.downvotedBy.filter(
      (userId) => userId.toString() !== req?.user?.id.toString()
    );

    // Add user to upvotedBy if they haven't already upvoted
    if (!answer.upvotedBy.includes(req?.user?.id)) {
      answer.upvotedBy.push(req?.user?.id);
    }

    await question.save();

    // Calculate upvotes and downvotes counts
    const upvotesCount = answer.upvotedBy.length;
    const downvotesCount = answer.downvotedBy.length;

    // Check if current user has upvoted or downvoted this answer
    const isUpvoted = answer.upvotedBy.includes(req?.user?.id);
    const isDownvoted = answer.downvotedBy.includes(req?.user?.id);

    res.status(200).json({
      message: "Answer upvoted successfully",
      upvotesCount,
      downvotesCount,
      isUpvoted,
      isDownvoted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upvote answer" });
  }
};

const downvoteAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Remove user from upvotedBy if they had previously upvoted
    answer.upvotedBy = answer.upvotedBy.filter(
      (userId) => userId.toString() !== req?.user?.id.toString()
    );

    // Add user to downvotedBy if they haven't already downvoted
    if (!answer.downvotedBy.includes(req?.user?.id)) {
      answer.downvotedBy.push(req?.user?.id);
    }

    await question.save();

    // Calculate upvotes and downvotes counts
    const upvotesCount = answer.upvotedBy.length;
    const downvotesCount = answer.downvotedBy.length;

    // Check if current user has upvoted or downvoted this answer
    const isUpvoted = answer.upvotedBy.includes(req?.user?.id);
    const isDownvoted = answer.downvotedBy.includes(req?.user?.id);

    res.status(200).json({
      message: "Answer downvoted successfully",
      upvotesCount,
      downvotesCount,
      isUpvoted,
      isDownvoted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to downvote answer" });
  }
};

// Report an answer
const reportAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const { description } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Add report details to the answer
    answer.reports.push({ reportedBy: req?.user?.id, description });

    // Create a new notification for the report
    const notification = new Notification({
      user_id: req?.user?.id,
      type: "report",
      message: `Answer reported: ${description}`,
      questionId: question?._id,
      answerId: answer?._id,
    });

    await question.save();
    await notification.save();
    res.status(200).json({ message: "Answer reported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to report answer" });
  }
};

// Function to create a category
const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Create new category object
    const newCategory = new Category({ name, description, slug });

    // Save new category to database
    await newCategory.save();

    // Return successful response with created category
    res.status(201).json(newCategory);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get all categories with pagination, search, filter, and sort
const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, sortBy, filterBy, query } = req.query;

  let queryOptions = {};
  let sortOptions = { updatedAt: -1 }; // Default sort by updatedAt in descending order

  try {
    // Parse sorting options if provided
    if (sortBy) {
      const [field, direction] = sortBy.split(":");
      sortOptions[field] = direction === "desc" ? -1 : 1;
    }

    // Parse filtering options if provided
    if (filterBy) {
      try {
        const filter = JSON.parse(filterBy);
        Object.assign(queryOptions, filter);
      } catch (error) {
        return res.status(400).json({ message: "Invalid filterBy parameter" });
      }
    }

    // Parse search query if provided
    if (query) {
      queryOptions.name = { $regex: query, $options: "i" };
    }

    // Fetch results with pagination, sorting, and filtering
    const categories = await paginateResults(
      Category.find(queryOptions),
      parseInt(page),
      parseInt(limit),
      { updatedAt: -1, ...sortOptions }
    );

    res
      .status(200)
      .json({ totalResults: categories.totalResults, data: categories.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get a category by slug
const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({ slug: slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
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
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to delete a category by slug
const deleteCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const deletedCategory = await Category.findOneAndDelete({ slug: slug });
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(deletedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
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
  getQuestionRecommendations,
  upvoteQuestion,
  downvoteQuestion,
  reportQuestion,
  upvoteAnswer,
  downvoteAnswer,
  reportAnswer,
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug,
};
