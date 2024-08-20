const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const { getNextSequenceValue } = require('../utils/autoIncrement'); // Adjust the path as needed
const { sendPasswordResetEmail, sendGenericEmail } = require('../services/emailService'); // Adjust path as needed
const jwt = require('jsonwebtoken');

// sendGenericEmail("maf415415@gmail.com", "Hey", "This is Afzal to Test email!")

const registerUser = async (req, res) => {
  const { username, email, password, role, favoriteGenre } = req.body;
  try {
    // Check if the user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Increment the serial number only for new users
    let serialNumber;
    if (!existingUser) {
      serialNumber = await getNextSequenceValue('userSerial', 'User');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      serialNumber,
      username,
      password: hashedPassword,
      email,
      role,
      favoriteGenre
    });
    
    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: `Failed to register user ${username}: ${error.message}` });
  }
};


const loginUser = (req, res, next) => {
  passport.authenticate('user-local', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    if (!user) return res.status(400).json({ message: info.message });
    
    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
      }
      // console.log(req?.user);
      res.status(200).json({ message: 'Logged in successfully' });
    });


  })(req, res, next);
};

const logoutUser = (req, res) => {
  // Log out the user
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to logout', error: err.message });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming you're using passport or similar for authentication

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password matches
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    } else if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password' });
    }


    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique reset token
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the reset token expiry time on the user object
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Save the updated user object
    await user.save();

    // Construct the password reset link
    // const resetLink = `${process.env.FRONTEND_ORIGIN}/api/auth/verifyToken?token=${resetToken}`;
    const resetLink = `${process.env.FRONTEND_ORIGIN}/reset-password?token=${resetToken}`;

    // Send the password reset email
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: `Password reset instructions sent to your email! Please Check your email: ${email}` });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Failed to process password reset request', error: error.message });
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.query;
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email and ensure the token has not expired
    const user = await User.findOne({
      email: decoded.email,
      resetTokenExpiry: { $gt: Date.now() } // Ensure the token has not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Token is valid
    res.status(200).json({ message: 'Token is valid', token });
  } catch (error) {
    console.error('Error in verifyToken:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email and ensure the token has not expired
    const user = await User.findOne({
      email: decoded.email,
      resetTokenExpiry: { $gt: Date.now() } // Ensure the token has not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token and expiry
    user.password = hashedPassword;
    user.resetTokenExpiry = null;

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};

const checkAuth = (req, res) => {
  // console.log("Session data:", req.session);
  // console.log("User authenticated:", req.isAuthenticated());

  if (req.isAuthenticated()) {
    return res.status(200).json({ auth: true });
  }
  return res.status(401).json({ auth: false });
};


module.exports = { registerUser, loginUser, logoutUser, changePassword, forgotPassword, verifyToken, resetPassword, checkAuth };
