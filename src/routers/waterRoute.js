//water route
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createWaterDataController,
  deleteWaterDataController,
  getWaterDataController,
  getWatersPerDayController,
  updateWaterDataController,
} from '../controllers/water.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createValidationSchema,
  updateValidationSchema,
} from '../validation/water.js';

const router = express.Router();

router.get('/', ctrlWrapper(getWaterDataController));
router.get('/:userId/day', ctrlWrapper(getWatersPerDayController));
router.get('/:userId/month');
router.post(
  '/',
  validateBody(createValidationSchema),
  ctrlWrapper(createWaterDataController),
);
router.put(
  '/:userId',
  validateBody(updateValidationSchema),
  ctrlWrapper(updateWaterDataController),
);
router.delete('/:userId', ctrlWrapper(deleteWaterDataController));

export default router;
