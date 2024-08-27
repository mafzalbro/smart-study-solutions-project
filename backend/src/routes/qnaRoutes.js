const express = require('express');
const router = express.Router();
const {
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
  deleteCategoryBySlug 
} = require('../controllers/qnaController');
const { auth } = require('../middlewares/auth');

// Question routes
router.post('/submit', auth, submitQuestion);
router.get('/questions', getAllQuestions);
router.get('/question/:slug', getQuestionBySlug); // Updated endpoint to use slug
router.put('/question/:slug', auth, updateQuestion); // Updated endpoint to use slug
router.delete('/question/:slug', auth, deleteQuestion); // Updated endpoint to use slug
router.post('/question/:slug/answer', auth, answerQuestion); // Updated endpoint to use slug
router.put('/question/:slug/answers/:answerId', auth, updateAnswer); // Updated endpoint to use slug and answerId
router.delete('/question/:slug/answers/:answerId', auth, deleteAnswer); // Updated endpoint to use slug and answerId
router.get('/user/:userSlug/questions', getUserQuestions); // Updated endpoint to use userSlug
router.get('/user/:userSlug/answers', getUserAnswers); // Updated endpoint to use userSlug
router.get('/recommendations', auth, getQuestionRecommendations);

router.post('/question/:slug/upvote', auth, upvoteQuestion);
router.post('/question/:slug/downvote', auth, downvoteQuestion);
router.post('/question/:slug/report', auth, reportQuestion);

// Upvote an answer
router.put('/question/:questionId/answers/:answerId/upvote', auth, upvoteAnswer);

// Downvote an answer
router.put('/question/:questionId/answers/:answerId/downvote', auth, downvoteAnswer);

// Report an answer
router.post('/question/:questionId/answers/:answerId/report', auth, reportAnswer);



// Category routes
router.post('/category', auth, createCategory);
router.get('/categories', getAllCategories);
router.get('/category/:slug', getCategoryBySlug);
router.put('/category/:slug', auth, updateCategoryBySlug);
router.delete('/category/:slug', auth, deleteCategoryBySlug);

module.exports = router;
