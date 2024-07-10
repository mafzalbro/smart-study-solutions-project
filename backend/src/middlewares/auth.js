const Admin = require('../models/admin');

console.log(process.env.FRONTEND_ORIGIN);

// middlewares/auth.js
const auth = async (req, res, next) => {
    if (req.isAuthenticated()) {
      const admin = await Admin.findOne({ username: req.user.username });
      if (admin) {
        res.status(401).json({ message: 'You are admin, Please login with user account' });
      } else{
        return next();
      }
    } else{
      // res.redirect(`${process.env.FRONTEND_ORIGIN}/login`);
      res.status(401).json({ message: 'Unauthorized' });
    }
    
  };
  
  module.exports = { auth };
  