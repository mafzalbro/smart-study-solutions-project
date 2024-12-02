// routes/contactRoutes.js
const express = require('express');
const { createContactMessage, getAllContacts, getContactByUserId, subscribeToNewsletter, sendNewsletter } = require('../controllers/contactController');
const { auth } = require('../middlewares/auth'); // Adjust path and middleware as needed
const { adminAuth } = require('../middlewares/adminAuth');

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', adminAuth, getAllContacts);
router.get('/user/:userId', auth, getContactByUserId);
router.post('/newsletter', subscribeToNewsletter);
router.post('/send-newsletter', adminAuth, sendNewsletter);


module.exports = router;
