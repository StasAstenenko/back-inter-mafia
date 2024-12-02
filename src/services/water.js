import { WaterModel } from '../db/models/waterSchema.js';

export const getWater = async ({ userId }) => {
  const data = await WaterModel.find({ userId });
  return data;
};

export const getWaterPerDay = async () => {
  const waterPerDay = await WaterModel.find();
  return waterPerDay;
};

export const createWaterData = async (payload) => {
  const data = await WaterModel.create(payload);
  return data;
};

export const deleteWaterData = async (waterId, userId) => {
  const data = await WaterModel.findOneAndDelete({ _id: waterId, userId });
  return data;
};

export const updateWaterData = async (waterId, waterData, userId) => {
  return await WaterModel.findOneAndUpdate(
    { _id: waterId, userId },
    waterData,
    { new: true },
  );
};
