const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:7000/auth/google/callback'  // must match Google Console exactly
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists by googleId
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Also check if email already registered via normal signup
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link googleId to existing account
        user.googleId = profile.id;
        await user.save({ validateBeforeSave: false });
      } else {
        // Brand new user — create with a random password (they won't use it)
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(16).toString('hex'), // satisfies required field
          user_type: 'client',   // default role for Google signup
          company_name: 'Not provided' // satisfies required field for non-admin
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Required for passport.session() — serializes user id into session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});