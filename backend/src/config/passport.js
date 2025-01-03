const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();

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
        console.log('User already there: ', {email: user.email})
        console.log({profile})
        // Update existing user with googleId
        user.googleId = profile.id;
        user.fullname = profile.displayName;
        user.username = profile.displayName.split(' ').join('-').toLowerCase();
        user.profileImage = profile.photos[0].value; // Update profile image if available
        await user.save();
      } else {
        // If user doesn't exist, create a new one
        console.log('New User: ', {email: profile.emails[0].value})
        user = new User({
          googleId: profile.id,
          fullname: profile.displayName,
          username: profile.displayName.split(' ').join('-').toLowerCase(),
          email: profile.emails[0].value,
          profileImage: profile.photos[0].value,
          emailVerified: profile._json.email_verified,
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
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.email); // Debugging
  done(null, user._id.toString()); // Ensure the ID is a string
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user ID:', id); // Debugging
  try {
    const user = await User.findById(id);
    // console.log('Deserialized user:', user); // Debugging
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


module.exports = passport;
