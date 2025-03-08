import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidID = (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw createHttpError(404, 'Not found');
  }

  next();
};

export const isValidIdWater = (req, res, next) => {
  const { waterId } = req.params;
  if (!isValidObjectId(waterId)) {
    throw createHttpError(404, 'The request is not valid');
  }
  next();
};
