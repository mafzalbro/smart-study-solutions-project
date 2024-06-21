const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Admin = require('../models/admin');

// Initialize session middleware with session timing
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000, // Session will expire after 1 hour (3600000 milliseconds)
    secure: false // Set to true if using HTTPS
   }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize user

passport.serializeUser((entity, done) => {
  done(null, { id: entity.id, type: entity.constructor.modelName });
});


// Deserialize user

passport.deserializeUser(async ({ id, type }, done) => {
  try {
    const entity = await (type === 'User' ? User.findById(id) : Admin.findById(id));
    done(null, entity);
  } catch (error) {
    done(error, null);
  }
});



// Local strategy for user login
passport.use('user-local', new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Local strategy for admin login
passport.use('admin-local', new LocalStrategy(async (username, password, done) => {
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return done(null, false, { message: 'Incorrect username.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, admin);
  } catch (error) {
    return done(error);
  }
}));

module.exports = passport;
