const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Username checks
  if (Validator.isEmpty(data.username) || Validator.isEmpty(data.password)) {
    errors.message = 'Please fill out all the fields';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
