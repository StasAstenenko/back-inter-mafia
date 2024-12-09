//users schema
import { model, Schema } from 'mongoose';
import { GENDER } from '../../constants/index.js';

const usersSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: [GENDER.WOMAN, GENDER.MAN],
      default: GENDER.WOMAN,
    },
    weight: {
      type: Number,
      default: 0,
    },
    activeTime: {
      type: Number,
      default: 0,
    },
    dailyNorm: {
      type: Number,
      default: 1500,
    },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
