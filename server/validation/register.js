const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {}; // Convert empty fields to an empty string so we can use validator functions
  data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
  data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (
    Validator.isEmpty(data.firstname) ||
    Validator.isEmpty(data.lastname) ||
    Validator.isEmpty(data.username) ||
    Validator.isEmpty(data.password)
  ) {
    errors.message = 'All fields are required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
