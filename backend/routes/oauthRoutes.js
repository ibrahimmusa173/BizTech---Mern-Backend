const router = require('express').Router();
const passport = require('passport');

// Step 1: Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend dashboard.
    res.redirect('http://localhost:3000/dashboard');
  }
);

// Get current user
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3000');
});

module.exports = router;