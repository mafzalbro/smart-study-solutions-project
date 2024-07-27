// routes/whatsappRoutes.js
const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../controllers/whatsappController.js');
const { auth } = require('../middlewares/auth');

router.post('/send', auth, sendWhatsAppMessage);

module.exports = router;
