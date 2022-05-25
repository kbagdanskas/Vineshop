const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required(),
});

const changePassword = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  changePassword,
};
