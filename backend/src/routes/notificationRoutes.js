const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { adminAuth } = require('../middlewares/adminAuth');



router.post('/', adminAuth, notificationController.createNotification);
router.get('/', adminAuth, notificationController.getNotifications);

module.exports = router;
