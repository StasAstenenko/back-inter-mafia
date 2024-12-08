import { SessionsCollection } from "../db/models/sessionsSchema.js";

// Функція для оновлення сесії користувача
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    // Знаходимо сесію в базі даних
    const session = await SessionsCollection.findOne({
      _id: sessionId,
      refreshToken,
    });
  
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
  
    // Перевіряємо, чи сесія не прострочена
    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  
    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }
  
    // Видаляємо стару сесію
    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  
    // Створюємо нову сесію
    const newSession = createSession();
  
    // Додаємо нову сесію для користувача
    return await SessionsCollection.create({
      userId: session.userId,
      ...newSession,
    });
  };