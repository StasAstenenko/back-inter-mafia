//user service
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/usersSchema.js';
import { SessionsCollection } from '../db/models/sessionsSchema.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { createSession } from '../utils/createSession.js';
// Reset Password Functionality
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';

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

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const getUserInfoBySession = async (userId) => {
  const user = await UsersCollection.findOne({ _id: userId });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

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

// Reset Password Functionality
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);
  console.log(user); 
  const html = template({
    name: user.name || 'Guest',
    link: `${env('APP_DOMAIN')}reset-pwd?token=${resetToken}`,
  });
  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
