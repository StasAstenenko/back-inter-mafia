//water schema

import mongoose, { model, Schema } from 'mongoose';

const waterSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: false,
    },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WaterModel = model('water', waterSchema);
