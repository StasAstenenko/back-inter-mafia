//user service
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/usersSchema.js';
import { SessionsCollection } from '../db/models/sessionsSchema.js';
// import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
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

  return { session, user };
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// export const refreshUsersSession = async (sessionId, refreshToken) => {
//   const session = await SessionsCollection.findOne({
//     refreshToken,
//     _id: sessionId,
//   });

//   if (!session) throw createHttpError(401, 'Session not found');
//   // if (new Date() > session.refreshTokenValidUntil) {
//   //   throw createHttpError(401, 'Refresh token is expired');
//   // }
//   const user = await UsersCollection.findById(session.userId);
//   console.log(session.userId);
//   if (!user) {
//     throw createHttpError(404, 'Session not found');
//   }
//   await SessionsCollection.deleteOne({ _id: sessionId });
//   return SessionsCollection.create({ userId: user._id, ...createSession() });
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   // Знайдіть існуючу сесію
//   const session = await SessionsCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   // Якщо сесія не знайдена, викликайте помилку
//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   // Перевірте, чи минув термін дії токену
//   const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

//   if (isSessionTokenExpired) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   // Видаліть стару сесію
//   await SessionsCollection.deleteOne({ _id: sessionId });

//   // Створіть нову сесію
//   const newSession = createSession();

//   // Додайте нову сесію для користувача
//   return await SessionsCollection.create({
//     userId: session.userId,
//     ...newSession,
//   });
// };
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
