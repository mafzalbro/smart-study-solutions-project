const express = require('express');
const router = express.Router();
const { changePassword, createAdmin, loginAdmin, logoutAdmin, forgotPassword, verifyToken, resetPassword, checkAuth } = require('../controllers/adminAuthController');
const { adminAuth } = require('../middlewares/adminAuth');

// Register a new admin
router.post('/create', createAdmin);

// Login admin
router.post('/login', loginAdmin);

// Logout admin
router.post('/logout', logoutAdmin);

// Change password
router.put('/changePassword', adminAuth, changePassword);

// Forgot password
router.post('/forgotPassword', forgotPassword);

// Verify token
router.get('/verifyToken', verifyToken);

// Reset password
router.post('/resetPassword', resetPassword);

// Check status
router.get('/check-auth', adminAuth, checkAuth);


module.exports = router