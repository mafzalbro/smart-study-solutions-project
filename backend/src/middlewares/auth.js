const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { clearExpiredCache } = require('../middlewares/cacheMiddleware');

const auth = async (req, res, next) => {

  try {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      await clearExpiredCache()
      return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    // Attach user data to request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { auth };
