const express = require('express');
const router = express.Router();
const { createChatOption, updateChatOption, removeChatOption, getChatOptionBySlug, chatWithPdfBySlug, getAllChatOptions, getChatTitles, getPdfTitles, setupAPIKey, fetchAPIKey } = require('../controllers/chatWithPdfController');
const { auth } = require('../middlewares/auth');

// Get all chats
router.get('/', auth, getAllChatOptions);

// Create a new chat option
router.post('/create', auth, createChatOption);

// Get all chat titles
router.get('/titles', auth, getChatTitles);

// Get all pdf chat titles
router.get('/pdf-titles', auth, getPdfTitles);

// get api key
router.get('/getApi', auth, fetchAPIKey);

// add api key
router.put('/addApi', auth, setupAPIKey);

// Chat with PDF for a specific chat option by slug
router.post('/:slug', auth, chatWithPdfBySlug);

// Get a chat option by slug
router.get('/:slug', auth, getChatOptionBySlug);

// Update a chat option by slug (title or adding new history)
router.put('/:slug', auth, updateChatOption);

// Remove a chat option by slug
router.delete('/:slug', auth, removeChatOption);

module.exports = router;
