/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    message: 'Authentication required',
    error: 'You must be logged in to access this resource',
    loginUrl: '/auth/github',
  });
};

module.exports = {
  isAuthenticated,
};
