//water validate
import Joi from 'joi';

export const createValidationSchema = Joi.object({
  amount: Joi.number().required(),
  // date: Joi.string()
  //   .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
  //   .required(),
  currentDailyNorm: Joi.number().required(),
});

export const updateValidationSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .required(),
  currentDailyNorm: Joi.number().required(),
});
