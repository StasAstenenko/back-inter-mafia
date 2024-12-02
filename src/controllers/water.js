import createHttpError from 'http-errors';
import {
  createWaterData,
  deleteWaterData,
  getWater,
  getWaterPerDay,
  updateWaterData,
} from '../services/water.js';

export const getWaterDataController = async (req, res, next) => {
  const data = await getWater({ userId: req.user._id });
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found data!',
    data,
  });
};

export const getWaterPerDayController = async (req, res) => {
  const waterPerDay = await getWaterPerDay();
  res.status(200).json({
    status: 200,
    message: 'Successfully found data!',
    data: waterPerDay,
  });
};

export const createWaterDataController = async (req, res) => {
  const { body } = req;
  const data = await createWaterData({ ...body, userId: req.user._id });
  res.status(200).json({
    status: 200,
    message: 'Successfully created data!',
    data,
  });
};

export const deleteWaterDataController = async (req, res, next) => {
  const { waterId } = req.params;

  const data = await deleteWaterData(waterId, req.user._id);
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }
  res.status(201).json({
    status: 201,
    message: 'Successfully deleted data!',
    data,
  });
};

export const updateWaterDataController = async (req, res, next) => {
  const { waterId } = req.params;

  const waterData = {
    amount: req.body.amount,
    date: req.body.date,
  };

  const data = await updateWaterData(waterId, waterData, req.user._id);
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated data!',
    data,
  });
};
