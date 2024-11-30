//valid id
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId =
  (idContact = 'id') =>
  (req, res, next) => {
    const id = req.params[idContact];
    if (!isValidObjectId(id)) {
      return next(createHttpError(400, 'Invalid id'));
    }
    return next();
  };
