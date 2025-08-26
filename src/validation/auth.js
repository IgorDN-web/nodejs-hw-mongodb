import Joi from 'joi';

export const registerContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a text.',
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name must be no more than 30 characters long.',
  }),

  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a text.',
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.',
  }),

  password: Joi.string().required().messages({
    'string.base': 'Password must be a text.',
    'string.empty': 'Password is required.',
  }),
});

export const loginContactSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
