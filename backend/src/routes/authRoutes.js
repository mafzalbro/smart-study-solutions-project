const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { changePassword, registerUser, loginUser, logoutUser, forgotPassword, verifyToken, resetPassword, checkAuth } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRES;

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// Change password
router.put('/changePassword', auth, changePassword);

// Forgot password
router.post('/forgotPassword', forgotPassword);

// Verify token
router.get('/verifyToken', verifyToken);

// Reset password
router.post('/resetPassword', resetPassword);

// Check status
router.get('/check-auth', auth, checkAuth);

// Route to initiate Google OAuth authentication
router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: req.query.state })(req, res, next);
});


// Route to handle Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_ORIGIN}/login` }), (req, res) => {
  const user = req.user;

  console.log({email: user.email})
  // Generate a JWT token for the user
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      // profileImage: user.profileImage,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  if(token){
    const redirectUrl = `${process.env.FRONTEND_ORIGIN}/?token=${token}`;
    return res.redirect(redirectUrl);
  }
  }
);


module.exports = router;
