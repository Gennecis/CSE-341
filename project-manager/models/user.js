// User model - defines structure and validation for user documents

const requiredFields = ['githubId', 'username'];

/**
 * Validates user data
 * @param {Object} userData - The user data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateUser = (userData) => {
  const errors = [];

  // Check for required fields
  requiredFields.forEach((field) => {
    if (!userData[field] || String(userData[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  // Validate githubId is a number or string number
  if (userData.githubId && isNaN(Number(userData.githubId))) {
    errors.push('githubId must be a valid number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Creates a user object from GitHub profile
 * @param {Object} profile - GitHub profile from OAuth
 * @returns {Object} - User object for MongoDB
 */
const createUserFromGitHub = (profile) => {
  return {
    githubId: profile.id,
    username: profile.username,
    displayName: profile.displayName || profile.username,
    email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
    profileUrl: profile.profileUrl,
    avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
    createdAt: new Date(),
    lastLogin: new Date(),
  };
};

module.exports = {
  requiredFields,
  validateUser,
  createUserFromGitHub,
};
