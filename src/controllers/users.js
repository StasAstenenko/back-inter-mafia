//users
import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  getUserInfoBySession,
  updateUserInfoBySession,
  getCountUsers,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
} from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { setupSession } from '../utils/setupSession.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
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

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshUsersSession(sessionId, refreshToken);
  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
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

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
