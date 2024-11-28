import { WaterModel } from '../db/models/waterSchema.js';

export const getWater = async () => {
  const data = WaterModel.find();
  return data;
};

export const getWatersPerDay = async () => {
  const waterPerDay = WaterModel.find();
  return waterPerDay;
};

export const createWaterData = async (payload) => {
  const data = WaterModel.create(payload);
  return data;
};

export const deleteWaterData = async (id) => {
  const data = WaterModel.findByIdAndDelete(id);
  return data;
};

export const updateWaterData = async (userId, waterData) => {
  return WaterModel.findByIdAndUpdate(userId, waterData, { new: true });
};
