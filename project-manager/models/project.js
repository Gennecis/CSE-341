// Project model - defines structure and validation for project documents
// Projects have 8 fields to meet the 7+ requirement

const requiredFields = ['name', 'description', 'startDate', 'endDate', 'status', 'budget', 'owner', 'priority'];
const validStatuses = ['planning', 'active', 'completed', 'on-hold', 'cancelled'];
const validPriorities = ['low', 'medium', 'high', 'urgent'];

/**
 * Validates project data
 * @param {Object} projectData - The project data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateProject = (projectData) => {
  const errors = [];

  // Check for required fields
  requiredFields.forEach((field) => {
    if (!projectData[field] || String(projectData[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  // Validate status if provided
  if (projectData.status && !validStatuses.includes(projectData.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate priority if provided
  if (projectData.priority && !validPriorities.includes(projectData.priority)) {
    errors.push(`priority must be one of: ${validPriorities.join(', ')}`);
  }

  // Validate budget is a positive number
  if (projectData.budget && isNaN(parseFloat(projectData.budget))) {
    errors.push('budget must be a valid number');
  } else if (projectData.budget && parseFloat(projectData.budget) < 0) {
    errors.push('budget must be a positive number');
  }

  // Validate dates
  if (projectData.startDate && isNaN(Date.parse(projectData.startDate))) {
    errors.push('startDate must be a valid date');
  }
  if (projectData.endDate && isNaN(Date.parse(projectData.endDate))) {
    errors.push('endDate must be a valid date');
  }

  // Validate endDate is after startDate
  if (projectData.startDate && projectData.endDate) {
    const start = new Date(projectData.startDate);
    const end = new Date(projectData.endDate);
    if (end < start) {
      errors.push('endDate must be after startDate');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates project data for updates (all fields optional but must be valid if provided)
 * @param {Object} projectData - The project data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateProjectUpdate = (projectData) => {
  const errors = [];

  // At least one field must be provided
  const hasAtLeastOneField = requiredFields.some((field) => projectData[field] !== undefined);

  if (!hasAtLeastOneField) {
    errors.push('At least one field must be provided for update');
  }

  // If fields are provided, they must not be empty
  requiredFields.forEach((field) => {
    if (projectData[field] !== undefined && String(projectData[field]).trim() === '') {
      errors.push(`${field} cannot be empty`);
    }
  });

  // Validate status if provided
  if (projectData.status && !validStatuses.includes(projectData.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate priority if provided
  if (projectData.priority && !validPriorities.includes(projectData.priority)) {
    errors.push(`priority must be one of: ${validPriorities.join(', ')}`);
  }

  // Validate budget if provided
  if (projectData.budget !== undefined) {
    if (isNaN(parseFloat(projectData.budget))) {
      errors.push('budget must be a valid number');
    } else if (parseFloat(projectData.budget) < 0) {
      errors.push('budget must be a positive number');
    }
  }

  // Validate dates if provided
  if (projectData.startDate && isNaN(Date.parse(projectData.startDate))) {
    errors.push('startDate must be a valid date');
  }
  if (projectData.endDate && isNaN(Date.parse(projectData.endDate))) {
    errors.push('endDate must be a valid date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  requiredFields,
  validStatuses,
  validPriorities,
  validateProject,
  validateProjectUpdate,
};
