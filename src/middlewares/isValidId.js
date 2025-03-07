import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidID = (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw createHttpError(404, 'Not found');
  }

  next();
};
