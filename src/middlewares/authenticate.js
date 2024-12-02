//middleware auth

import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/usersSchema.js';
import { SessionsCollection } from '../db/models/sessionsSchema.js';

export const authenticate = async (req, res, next) => {
  const authorization = req.get('Authorization');
  if (!authorization) {
    return next(createHttpError(401, 'Authorization Unauthorized'));
  }

  const [bearer, accessToken] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'bearer !== "Bearer" Unauthorized'));
  }
  if (typeof accessToken !== 'string') {
    return next(createHttpError(401, 'typeof accessToken !== "string" Unauthorized'));
  }

  const session = await SessionsCollection.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, '!session Unauthorized'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (user === null) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
