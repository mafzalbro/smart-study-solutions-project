const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRES;

// Create Admin
const createAdmin = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });
    
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register admin' });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Incorrect username or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect username or password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logout Admin (Optional with JWT - Just remove token client-side)
const logoutAdmin = (req, res) => {
  // In a JWT setup, logout is handled client-side by deleting the token
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { createAdmin, loginAdmin, logoutAdmin };
