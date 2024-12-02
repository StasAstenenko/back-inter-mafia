//water route
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createWaterDataController,
  deleteWaterDataController,
  getWaterDataController,
  getWaterPerDayController,
  updateWaterDataController,
} from '../controllers/water.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createValidationSchema,
  updateValidationSchema,
} from '../validation/water.js';
import { authenticate } from '../middlewares/authenticate.js';

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.get('/', ctrlWrapper(getWaterDataController));
waterRouter.get('/:waterId', ctrlWrapper(getWaterPerDayController));
// waterRouter.get('/:userId/month');
waterRouter.post(
  '/',
  validateBody(createValidationSchema),
  ctrlWrapper(createWaterDataController),
);
waterRouter.patch(
  '/:waterId',
  validateBody(updateValidationSchema),
  ctrlWrapper(updateWaterDataController),
);
waterRouter.delete('/:waterId', ctrlWrapper(deleteWaterDataController));

export default waterRouter;
