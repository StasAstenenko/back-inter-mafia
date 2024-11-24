//user route
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
    registerUserSchema,
    loginUserSchema,
    updateUserSchema
} from '../validation/users.js';
import {
    registerUserController,
    loginUserController,
    logoutUserController,
    refreshUserSessionController,
    getUserInfoController,
    patchUserInfoController
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.post(
    '/register',
    upload.single('photo'),
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
    ctrlWrapper(getUserInfoController),
);

userRouter.patch(
    '/',
    upload.single('photo'),
    validateBody(updateUserSchema),
    ctrlWrapper(patchUserInfoController),
);
