//user route
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema,
} from '../validation/users.js';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    refreshUserSessionController,
    getUserInfoController,
    patchUserInfoController,
    getCountUsersController,
    requestResetEmailController,
    resetPasswordController,
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

userRouter.get(
    '/',
    authenticate,
    ctrlWrapper(getUserInfoController),
);

userRouter.patch(
    '/',
    upload.single('avatarUrl'),
    authenticate,
    validateBody(updateUserSchema),
    ctrlWrapper(patchUserInfoController),
);

userRouter.get(
    '/count-user',
    ctrlWrapper(getCountUsersController),
);

// Reset Password Functionality
userRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

userRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default userRouter;
