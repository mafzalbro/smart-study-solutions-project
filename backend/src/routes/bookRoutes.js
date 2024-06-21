const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController.js');
const { adminAuth } = require('../middlewares/adminAuth');
const { auth } = require('../middlewares/auth');

// Routes for books
router.get('/', bookController.getAllBooks); // page = 1, limit = 5
router.get('/sort', bookController.sortAllBooks);
router.get('/filter', bookController.filterAllBooks);
router.get('/search', bookController.searchAllBooks);
router.get('/recommend', auth, bookController.recommendBook);
router.get('/book/:id', bookController.getBookById);
router.post('/addBook/', adminAuth, bookController.addBook);
router.put('/book/:id', adminAuth, bookController.updateBook);
router.delete('/book/:id', adminAuth, bookController.deleteBook);

module.exports = router;
