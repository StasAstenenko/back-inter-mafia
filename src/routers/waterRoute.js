//water route
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createWaterDataController,
  deleteWaterDataController,
  getWaterDataController,
  getWaterPerDateController,
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
waterRouter.get('/water-per-day', ctrlWrapper(getWaterPerDateController));
waterRouter.get('/water-per-month', ctrlWrapper(getWaterPerDateController));
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
