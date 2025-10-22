export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateGig = (gigData) => {
  const errors = {};

  if (!gigData.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!gigData.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!gigData.budget || gigData.budget < 1) {
    errors.budget = 'Valid budget is required';
  }

  if (!gigData.category?.trim()) {
    errors.category = 'Category is required';
  }

  if (!gigData.location?.trim()) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};