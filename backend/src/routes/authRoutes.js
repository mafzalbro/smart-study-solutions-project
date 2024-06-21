const express = require('express');
const router = express.Router();
const { changePassword, registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// Change password (requires authentication)
router.put('/change-password', auth, changePassword);

module.exports = router;
