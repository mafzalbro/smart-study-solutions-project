const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Admin = require('../models/admin');
require('dotenv').config();

// Serialize user or admin
passport.serializeUser((entity, done) => {
  done(null, { id: entity.id, type: entity.constructor.modelName });
});

// Deserialize user or admin
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

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_ORIGIN}/api/auth/google/callback`,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists by googleId
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Check if user already exists by email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Update existing user with googleId
        user.googleId = profile.id;
        await user.save();
      } else {
        // If user doesn't exist, create a new one
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          profileImage: profile.photos[0].value,
          role: 'student',
          favoriteGenre: 'fiction',
        });
        await user.save();
      }
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}
));

module.exports = passport;
