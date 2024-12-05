// user validate
import Joi from 'joi';

export const registerUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


export const updateUserSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
    name: Joi.string().min(3).max(30),
    gender: Joi.string().valid('woman', 'man'),
    weight: Joi.number().min(10).max(300),
    activeTime: Joi.number().min(0).max(24),
    dailyNorm: Joi.number().min(1000).max(15000)
});

// Reset Password Functionality
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
