import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidID = (req, res, next) => {
  const { woterId } = req.params;

  if (!isValidObjectId(woterId)) {
    throw createHttpError(404, 'Not found');
  }

  next();
};
