import createHttpError from 'http-errors';
import {
  createWaterData,
  deleteWaterData,
  getWater,
  getWatersPerDay,
  updateWaterData,
} from '../services/water.js';

export const getWaterDataController = async (req, res, next) => {
  const data = await getWater();
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found data!',
    data,
  });
};

export const getWatersPerDayController = async (req, res) => {
  const waterPerDay = await getWatersPerDay();
  res.status(200).json({
    status: 200,
    message: 'Successfully found data!',
    data: waterPerDay,
  });
};

export const createWaterDataController = async (req, res) => {
  const { body } = req;
  const data = await createWaterData(body);
  res.status(200).json({
    status: 200,
    message: 'Successfully create data!',
    data,
  });
};

export const deleteWaterDataController = async (req, res, next) => {
  const { id } = req.params;

  const data = await deleteWaterData(id);
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }
  res.status(201).json({
    status: 201,
    message: 'Successfully delete data!',
    data,
  });
};

export const updateWaterDataController = async (req, res, next) => {
  const { id } = req.params;

  const waterData = {
    amount: req.body.amount,
    date: req.body.date,
    currentDailyNorm: req.body.currentDailyNorm,
  };

  const data = await updateWaterData(id, waterData);
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully update data!',
    data,
  });
};
