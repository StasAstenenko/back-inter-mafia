//users
import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfoBySession,
  updateUserInfoBySession,
  getCountUsers,
  requestResetToken,
  resetPassword,
} from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { setupSession } from '../utils/setupSession.js';
import { refreshUsersSession } from '../utils/refreshSession.js';
import { UsersCollection } from '../db/models/usersSchema.js';
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const data = await loginUser(req.body);
  setupSession(res, data.session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: data.session.accessToken,
      user: data.user,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// Контролер для оновлення сесії
// export const refreshUserSessionController = async (req, res) => {
//   try {
//     const session = await refreshUsersSession({
//       sessionId: req.cookies.sessionId,
//       refreshToken: req.cookies.refreshToken,
//     });

//     refreshUsersSession(res, session);
//     res.json({
//       status: 200,
//       message: 'Successfully refreshed a session!',
//       data: {
//         accessToken: session.accessToken,
//       },
//     });
//   } catch (error) {
//     res.status(error.status || 500).json({ message: error.message });
//   }
// };
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      return res.status(400).json({
        status: 400,
        message: 'Missing session ID or refresh token',
      });
    }

    const session = await refreshUsersSession({ sessionId, refreshToken });
    const user = await UsersCollection.findOne({ _id: session.userId });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInfoController = async (req, res) => {
  const user = await getUserInfoBySession(req.user);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: 'User info found successfully',
    data: user,
  });
};

export const patchUserInfoController = async (req, res) => {
  const userId = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updatedUser = await updateUserInfoBySession(userId, {
    ...req.body,
    avatarUrl: photoUrl,
  });

  res.status(200).json({
    status: 200,
    message: 'User info updated successfully',
    data: updatedUser,
  });
};

export const getCountUsersController = async (req, res) => {
  const count = await getCountUsers();

  res.json({
    status: 200,
    message: 'Count users found successfully',
    data: count,
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
