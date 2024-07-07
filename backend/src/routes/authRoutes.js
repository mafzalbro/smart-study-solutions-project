const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const { changePassword, registerUser, loginUser, logoutUser, forgotPassword, verifyToken, resetPassword, checkAuth } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// Change password
router.put('/changePassword', auth, changePassword);

// forgot password
router.post('/forgotPassword', forgotPassword);

// verify token
router.get('/verifyToken', verifyToken);

// reset password
router.post('/resetPassword', resetPassword);

//check status that it is logged in or not
router.get('/check-auth', checkAuth);

// Route to initiate Google OAuth authentication
router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: req.query.state })(req, res, next);
});

// Route to handle Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const user = req.user;
  console.log(user);

  // Check if user has missing credentials
  const hasMissingCredentials = !user.username || !user.email || !user.role || !user.favoriteGenre || !user.password;

  if (hasMissingCredentials) {
    const redirectUrl = `${process.env.FRONTEND_ORIGIN}/update-profile?user=${user.id}`;
    res.redirect(redirectUrl);
  } else {
    const redirectUrl = `${process.env.FRONTEND_ORIGIN}/`;
    res.redirect(redirectUrl);
  }
});



module.exports = router;
