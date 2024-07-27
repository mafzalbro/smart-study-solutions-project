const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const passport = require('../config/passport');

const createAdmin = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new admin document
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });
    
    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register admin' });
  }
};

const loginAdmin = (req, res, next) => {
  passport.authenticate('admin-local', (err, admin, info) => {
    if (err) return next(err);
    if (!admin) return res.status(400).json({ message: info.message });

    // Log in the admin
    req.logIn(admin, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
};

const logoutAdmin = (req, res) => {
  // Log out the admin
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
  
  res.redirect('/');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { createAdmin, loginAdmin, logoutAdmin };
