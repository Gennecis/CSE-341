// Contact model - defines the structure and validation for contact documents

const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

/**
 * Validates contact data
 * @param {Object} contactData - The contact data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateContact = (contactData) => {
  const errors = [];

  // Check for required fields
  requiredFields.forEach((field) => {
    if (!contactData[field] || contactData[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates contact data for updates (all fields optional but must be valid if provided)
 * @param {Object} contactData - The contact data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateContactUpdate = (contactData) => {
  const errors = [];

  // At least one field must be provided
  const hasAtLeastOneField = requiredFields.some((field) => contactData[field] !== undefined);

  if (!hasAtLeastOneField) {
    errors.push('At least one field must be provided for update');
  }

  // If fields are provided, they must not be empty
  requiredFields.forEach((field) => {
    if (contactData[field] !== undefined && contactData[field].trim() === '') {
      errors.push(`${field} cannot be empty`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  requiredFields,
  validateContact,
  validateContactUpdate,
};
