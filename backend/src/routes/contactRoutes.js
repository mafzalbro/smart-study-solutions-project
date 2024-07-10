// routes/contactRoutes.js
const express = require('express');
const { createContactMessage, getAllContacts, getContactByUserId, subscribeToNewsletter } = require('../controllers/contactController');
const { auth } = require('../middlewares/auth'); // Adjust path and middleware as needed

const router = express.Router();

router.post('/', createContactMessage);
router.get('/all', getAllContacts);
router.get('/user/:userId', auth, getContactByUserId);
router.post('/newsletter', subscribeToNewsletter);

module.exports = router;
