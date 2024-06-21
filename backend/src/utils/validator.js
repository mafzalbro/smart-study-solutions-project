// utils/validator.js
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('username').isLength({ min: 5 }),
  body('password').isLength({ min: 5 }),
  body('email').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegistration };
