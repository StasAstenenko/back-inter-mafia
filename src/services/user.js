//user service
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/usersSchema.js';
import { SessionsCollection } from '../db/models/sessionsSchema.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { createSession } from '../utils/createSession.js'

export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    const session = await SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });

    return session;
};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired =
        new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

    return await SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });
};

export const getUserInfoBySession = async (sessionId) => {
    const session = await SessionsCollection.findById(sessionId);
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    return user;
};

export const updateUserInfoBySession = async (sessionId, payload) => {
    const session = await SessionsCollection.findById(sessionId);
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    for (const key in payload) {
        if (key === 'password') {
            user[key] = await bcrypt.hash(payload[key], 10);
        } else {
            user[key] = payload[key];
        }
    }

    await user.save();

    return user;
};