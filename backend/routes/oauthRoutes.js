const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Step 1: Redirect user to Google login page
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2: Google redirects back here with a code
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,         // we use JWT, not sessions
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`
  }),
  (req, res) => {
    // passport.js has already found/created the user and put them in req.user
    const token = jwt.sign(
      { id: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    // Redirect to frontend with token — frontend will store it
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}&user_type=${req.user.user_type}`);
  }
);

module.exports = router;