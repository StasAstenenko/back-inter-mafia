import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessionsSchema.js';
import { createSession } from './createSession.js';

// Функція для оновлення сесії користувача
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Перевіряємо, чи сесія не прострочена
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  // Створюємо нову сесію
  const newSession = createSession();

  // Видаляємо стару сесію
  await SessionsCollection.deleteOne({
    _id: sessionId,
  });

  // Додаємо нову сесію для користувача
  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
