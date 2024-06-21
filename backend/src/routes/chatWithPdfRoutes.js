const express = require('express');
const router = express.Router();
const { createChatOption, updateChatOption, removeChatOption, getChatOptionById, chatWithPdfById, getAllChatOptions, getAllChatTitles } = require('../controllers/chatWithPdfController');
const { auth } = require('../middlewares/auth');

// Get all chats
router.get('/', auth, getAllChatOptions);

// Create a new chat option
router.post('/create', auth, createChatOption);

// Get all chat titles
router.get('/titles', auth, getAllChatTitles);


// Chat with PDF for a specific chat option by ID
router.post('/:chatId', auth, chatWithPdfById);

// Get a chat option by ID
router.get('/:chatId', auth, getChatOptionById);

// Update a chat option by ID (title or adding new history)
router.put('/:chatId', auth, updateChatOption);

// Remove a chat option by ID
router.delete('/:chatId', auth, removeChatOption);

module.exports = router;
