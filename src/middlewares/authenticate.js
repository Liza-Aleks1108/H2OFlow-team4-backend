import createHttpError from 'http-errors';
import { SessionsCollection } from '../dB/sessionsSchema.js';
import { UserCollection } from '../dB/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};
