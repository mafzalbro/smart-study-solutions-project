const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const { getNextSequenceValue } = require('../utils/autoIncrement'); // Adjust the path as needed

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
    res.status(500).json({ message: `Failed to register user ${username}`, error: error.message });
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

module.exports = { registerUser, loginUser, logoutUser, changePassword };
