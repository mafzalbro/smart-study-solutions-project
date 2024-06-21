const express = require('express');
const router = express.Router();
const { submitQuestion, answerQuestion } = require('../controllers/qnaController');
const { auth } = require('../middlewares/auth'); // Authentication middleware

// Route to submit a question
router.post('/submit', auth, submitQuestion);

// Route to answer a question
router.put('/answer/:id', auth, answerQuestion);

module.exports = router;
