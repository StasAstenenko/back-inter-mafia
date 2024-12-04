//user route
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/users.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  getUserInfoController,
  patchUserInfoController,
  getCountUsersController,
  loginWithGoogleController,
  getGoogleOAuthUrlController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js';
import { authenticate } from '../middlewares/authenticate.js';

const userRouter = Router();

userRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

userRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

userRouter.post('/logout', ctrlWrapper(logoutUserController));

userRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

userRouter.get('/', authenticate, ctrlWrapper(getUserInfoController));

userRouter.patch(
  '/',
  upload.single('avatarUrl'),
  authenticate,
  validateBody(updateUserSchema),
  ctrlWrapper(patchUserInfoController),
);

userRouter.get('/count-user', ctrlWrapper(getCountUsersController));

userRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

userRouter.post(
  '/google-auth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default userRouter;
