import { WaterModel } from '../db/models/waterSchema.js';

export const getWater = async () => {
  const data = await WaterModel.find();
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

export const deleteWaterData = async (id) => {
  const data = await WaterModel.findByIdAndDelete(id);
  return data;
};

export const updateWaterData = async (waterId, waterData) => {
  return await WaterModel.findByIdAndUpdate(waterId, waterData, { new: true });
};
