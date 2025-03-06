import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof createHttpError.HttpError) {
    res.status(err.status).json({
      message: err.message,
    });
    return;
  }
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
