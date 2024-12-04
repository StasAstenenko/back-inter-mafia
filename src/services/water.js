import { WaterModel } from '../db/models/waterSchema.js';

export const getWater = async ({ userId }) => {
  const data = await WaterModel.find({ userId });
  console.log(data);
  return data;
};

export const getWaterPerDate = async (userId, date) => {
  const waterData = await WaterModel.find({
    userId,
    date: { $regex: `^${date}` },
  });

  return waterData;
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
