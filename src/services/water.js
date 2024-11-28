import { WaterModel } from '../db/models/waterSchema.js';

export const getWater = async () => {
  const data = await WaterModel.find();
  return data;
};

export const getWatersPerDay = async () => {
  const waterPerDay = await WaterModel.find();
  return waterPerDay;
};

export const createWaterData = async (payload) => {
  const data = await WaterModel.create(payload);
  return data;
};

export const deleteWaterData = async (id) => {
  const data = await WaterModel.findByIdAndDelete(id);
  return data;
};

export const updateWaterData = async (userId, waterData) => {
  return await WaterModel.findByIdAndUpdate(userId, waterData, { new: true });
};
