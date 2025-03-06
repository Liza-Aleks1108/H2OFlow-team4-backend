import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { ObjectId } from 'mongodb';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../dB/sessionsSchema.js';
import { UserCollection } from '../dB/user.js';

export const register = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

export const login = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });
  if (!user) throw createHttpError(401, 'Email or password is wrong');
  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid)
    throw createHttpError(401, 'Email or password is wrong');

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);
  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: new ObjectId(sessionId),
    refreshToken,
  });
  console.log('Сессия:', session);

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(session.userId);

  await SessionsCollection.deleteOne({
    _id: new ObjectId(sessionId),
    refreshToken,
  });

  const newSessionData = await SessionsCollection.create(newSession);
  console.log('Новая сессия с данными:', newSessionData);

  return newSessionData;
};
