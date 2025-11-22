// Task model - defines structure and validation for task documents
// Tasks have 7 fields

const requiredFields = ['title', 'description', 'projectId', 'status', 'dueDate', 'assignedTo', 'priority'];
const validStatuses = ['todo', 'in-progress', 'completed'];
const validPriorities = ['low', 'medium', 'high', 'urgent'];

/**
 * Validates task data
 * @param {Object} taskData - The task data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateTask = (taskData) => {
  const errors = [];

  // Check for required fields
  requiredFields.forEach((field) => {
    if (!taskData[field] || String(taskData[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  // Validate status if provided
  if (taskData.status && !validStatuses.includes(taskData.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate priority if provided
  if (taskData.priority && !validPriorities.includes(taskData.priority)) {
    errors.push(`priority must be one of: ${validPriorities.join(', ')}`);
  }

  // Validate dueDate
  if (taskData.dueDate && isNaN(Date.parse(taskData.dueDate))) {
    errors.push('dueDate must be a valid date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates task data for updates (all fields optional but must be valid if provided)
 * @param {Object} taskData - The task data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validateTaskUpdate = (taskData) => {
  const errors = [];

  // At least one field must be provided
  const hasAtLeastOneField = requiredFields.some((field) => taskData[field] !== undefined);

  if (!hasAtLeastOneField) {
    errors.push('At least one field must be provided for update');
  }

  // If fields are provided, they must not be empty
  requiredFields.forEach((field) => {
    if (taskData[field] !== undefined && String(taskData[field]).trim() === '') {
      errors.push(`${field} cannot be empty`);
    }
  });

  // Validate status if provided
  if (taskData.status && !validStatuses.includes(taskData.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate priority if provided
  if (taskData.priority && !validPriorities.includes(taskData.priority)) {
    errors.push(`priority must be one of: ${validPriorities.join(', ')}`);
  }

  // Validate dueDate if provided
  if (taskData.dueDate && isNaN(Date.parse(taskData.dueDate))) {
    errors.push('dueDate must be a valid date');
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
  validateTask,
  validateTaskUpdate,
};
