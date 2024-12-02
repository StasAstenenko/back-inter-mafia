//users
import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  getUserInfoBySession,
  updateUserInfoBySession,
  getCountUsers
} from '../services/user.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { setupSession } from '../utils/setupSession.js';

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
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

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
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await getUserInfoBySession(sessionId);

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
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    throw createHttpError(401, 'Unauthorized');
  }

  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updatedUser = await updateUserInfoBySession(sessionId, {
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
