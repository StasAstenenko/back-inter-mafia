//user service
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/usersSchema.js';
import { SessionsCollection } from '../db/models/sessionsSchema.js';
// import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { createSession } from '../utils/createSession.js';

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
    throw createHttpError(401, 'Credentials are wrong');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const session = await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async (sessionId, refreshToken) => {
  const session = await SessionsCollection.findOne({
    refreshToken,
    _id: sessionId,
  });

  if (!session) throw createHttpError(401, 'Session not found');
  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(404, 'Session not found');
  }
  await SessionsCollection.deleteOne({ _id: sessionId });
  return SessionsCollection.create({ userId: user._id, ...createSession() });
};

export const getUserInfoBySession = async (userId) => {
  const user = await UsersCollection.findOne({ _id: userId });

  return user;
};

export const updateUserInfoBySession = async (userId, payload) => {
  const user = await UsersCollection.findOne({ _id: userId });
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

export const getCountUsers = async () => {
  const users = await UsersCollection.find();
  return users.length;
};
