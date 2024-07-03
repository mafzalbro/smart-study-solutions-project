const express = require('express');
const router = express.Router();
const { submitQuestion, answerQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion,
    // getQuestionAnswers,
    updateAnswer, deleteAnswer, getUserQuestions, getUserAnswers, recommendQuestions, createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/qnaController');
const { auth } = require('../middlewares/auth');

// console.log("WORKING WITH QNA ROUTES");

// Question routes
router.post('/submit', auth, submitQuestion);
router.get('/questions', getAllQuestions);
router.get('/question/:id', getQuestionById);
router.put('/question/:id', auth, updateQuestion);
router.delete('/question/:id', auth, deleteQuestion);
// router.get('/question/:id/answers', getQuestionAnswers);
router.post('/question/:id/answer', auth, answerQuestion);
router.put('/question/:id/answers/:answerId', auth, updateAnswer);
router.delete('/question/:id/answers/:answerId', auth, deleteAnswer);
router.get('/user/:userId/questions', getUserQuestions);
router.get('/user/:userId/answers', getUserAnswers);
router.get('/recommendations', auth, recommendQuestions);

// Category routes
router.post('/categories', auth, createCategory);
router.get('/categories', getAllCategories);
router.put('/categories/:id', auth, updateCategory);
router.delete('/categories/:id', auth, deleteCategory);

module.exports = router;
