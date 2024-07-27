// routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin, logoutAdmin } = require('../controllers/adminAuthController.js');


router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

module.exports = router;
