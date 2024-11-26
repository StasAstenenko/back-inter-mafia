//users
import createHttpError from 'http-errors';

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshUsersSession,
    getUserInfo,
    updateUserInfo
} from '../services/user.js';
import { THIRTY_DAYS } from '../constants/index.js';

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });

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


const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
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
    const userId = req.cookies.sessionId;
    if (!userId) {
        throw createHttpError(401, 'Unauthorized');
    }

    const user = await getUserInfo(userId);

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
    const userId = req.cookies.sessionId;
    if (!userId) {
        throw createHttpError(401, 'Unauthorized');
    }

    const updatePayload = req.body;
    if (req.file) {
        updatePayload.photo = req.file.path;
    }

    const updatedUser = await updateUserInfo(userId, updatePayload);

    res.status(200).json({
        status: 200,
        message: 'User info updated successfully',
        data: updatedUser,
    });
};