const Admin = require('../models/admin');
// const Admin = require('../models/user');

const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the admin by username from the Admin collection
    const admin = await Admin.findOne({ username: req.user.username });

    // Check if the user is an admin
    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // If user is authenticated and is an admin, proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { adminAuth };
