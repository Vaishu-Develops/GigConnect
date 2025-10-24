export const validateRequired = (value) => {
  if (!value || value.toString().trim() === '') {
    return 'This field is required';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateMinLength = (value, minLength) => {
  if (value && value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength) => {
  if (value && value.length > maxLength) {
    return `Must be less than ${maxLength} characters`;
  }
  return null;
};

export const validateNumber = (value, min = null, max = null) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return 'Must be a valid number';
  }
  
  if (min !== null && num < min) {
    return `Must be at least ${min}`;
  }
  
  if (max !== null && num > max) {
    return `Must be at most ${max}`;
  }
  
  return null;
};

export const validateUrl = (url) => {
  if (!url) return null;
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

export const validateGigBudget = (budget) => {
  if (!budget) return 'Budget is required';
  
  const num = Number(budget);
  if (isNaN(num) || num < 100) {
    return 'Budget must be at least ₹100';
  }
  
  if (num > 1000000) {
    return 'Budget cannot exceed ₹10,00,000';
  }
  
  return null;
};

export const validateSkills = (skills) => {
  if (!skills || skills.length === 0) {
    return 'At least one skill is required';
  }
  
  if (skills.length > 10) {
    return 'Maximum 10 skills allowed';
  }
  
  return null;
};

export const createValidator = (rules) => {
  return (values) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const value = values[field];
      const fieldRules = rules[field];
      
      for (const rule of fieldRules) {
        const error = rule(value, values);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    });
    
    return errors;
  };
};