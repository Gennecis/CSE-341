const router = require('express').Router();
const passport = require('passport');

/**
 * GET /auth/github
 * @summary Initiate GitHub OAuth login
 * @tags Authentication
 * @return {redirect} 302 - Redirects to GitHub OAuth page
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * GET /auth/github/callback
 * @summary GitHub OAuth callback
 * @tags Authentication
 * @return {redirect} 302 - Redirects to home page on success
 * @return {redirect} 302 - Redirects to login page on failure
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/auth/login/success');
  }
);

/**
 * GET /auth/login/success
 * @summary Login success page
 * @tags Authentication
 * @return {object} 200 - Success message with user info
 */
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      user: {
        id: req.user._id,
        githubId: req.user.githubId,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
});

/**
 * GET /auth/login/failed
 * @summary Login failed page
 * @tags Authentication
 * @return {object} 401 - Failure message
 */
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failed',
  });
});

/**
 * GET /auth/logout
 * @summary Logout user
 * @tags Authentication
 * @return {object} 200 - Success message
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed', error: err.message });
      }
      // Clear the session cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      res.status(200).json({
        success: true,
        message: 'Successfully logged out',
      });
    });
  });
});

/**
 * GET /auth/user
 * @summary Get current logged-in user
 * @tags Authentication
 * @return {object} 200 - User object
 * @return {object} 401 - Not authenticated
 */
router.get('/user', (req, res) => {
  if (req.user) {
    res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        githubId: req.user.githubId,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
      },
    });
  } else {
    res.status(401).json({
      authenticated: false,
      message: 'Not authenticated',
    });
  }
});

module.exports = router;
