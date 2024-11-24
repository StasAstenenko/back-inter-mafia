//water schema
// import { number } from 'joi';
import mongoose, { model, Schema } from 'mongoose';
import Joi from 'joi';

const waterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: { type: String, required: true },
    currentDailyNorm: { type: Number, required: true },
    createdAt: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const createValidationSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .required(),
  currentDailyNorm: Joi.number().required(),
  createdAt: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .required(),
});

export const updateValidationSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
    .required(),
  currentDailyNorm: Joi.number().required(),
});

export const WaterModel = model('water', waterSchema);
