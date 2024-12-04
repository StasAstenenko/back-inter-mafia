import createHttpError from 'http-errors';
import {
  createWaterData,
  deleteWaterData,
  getWater,
  getWaterPerDate,
  updateWaterData,
} from '../services/water.js';

export const getWaterDataController = async (req, res, next) => {
  const data = await getWater({ userId: req.user._id });
  console.log(data);
  if (!data) {
    return next(createHttpError(404, 'Data not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully found data!',
    data,
  });
};

export const getWaterPerDateController = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;

    const waterData = await getWaterPerDate(userId, date);
    console.log(waterData);

    if (waterData.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No data found for the selected date.',
        data: [],
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved data!',
      data: waterData,
    });
  } catch (error) {
    next(error);
  }
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
