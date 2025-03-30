import bcrypt from 'bcrypt';
// import { randomBytes } from 'crypto';
import handlebars from 'handlebars';
import createHttpError, { HttpError } from 'http-errors';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import fs from 'node:fs/promises';
import path from 'path';
import { TEMPLATES_DIR } from '../constants/index.js';
// import { FIFTEEN_MINUTES, ONE_DAY, TEMPLATES_DIR } from '../constants/index.js';
import { SessionsCollection } from '../dB/sessionsSchema.js';
import { UserCollection } from '../dB/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import 'dotenv/config';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const loginUser = async (email, password) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw HttpError(400, 'Email or password is wrong');
  }

  if (!user.isVerified) {
    throw HttpError(400, 'Email is not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(400, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '30d',
  });

  await UserCollection.findByIdAndUpdate(user._id, { token, refreshToken });

  return { user, token, refreshToken };
};

// export const login = async (payload) => {
//   const user = await UserCollection.findOne({
//     email: payload.email,
//   });
//   if (!user) throw createHttpError(401, 'Email or password is wrong');
//   const isPasswordValid = await bcrypt.compare(payload.password, user.password);
//   if (!isPasswordValid)
//     throw createHttpError(401, 'Email or password is wrong');

//   await SessionsCollection.deleteOne({ userId: user._id });

//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return await SessionsCollection.create({
//     userId: user._id,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
//   });
// };

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// const createSession = (userId) => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
//   const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);
//   return {
//     userId,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil,
//     refreshTokenValidUntil,
//   };
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   if (!sessionId || !refreshToken) {
//     throw createHttpError(401, 'No active session found');
//   }

//   let session;
//   try {
//     session = await SessionsCollection.findOne({
//       _id: new ObjectId(sessionId),
//       refreshToken,
//     });
//   } catch (e) {
//     throw createHttpError(401, 'Invalid session ID format');
//   }

//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   if (new Date() > new Date(session.refreshTokenValidUntil)) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   const newSession = createSession(session.userId);

//   await SessionsCollection.deleteOne({ _id: session._id });

//   const newSessionData = await SessionsCollection.create(newSession);

//   return newSessionData;
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   const session = await SessionsCollection.findOne({
//     _id: new ObjectId(sessionId),
//     refreshToken,
//   });
//   console.log('Сессия:', session);

//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   const isSessionTokenExpired =
//     new Date() > new Date(session.refreshTokenValidUntil);
//   if (isSessionTokenExpired) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   const newSession = createSession(session.userId);

//   await SessionsCollection.deleteOne({
//     _id: new ObjectId(sessionId),
//     refreshToken,
//   });

//   const newSessionData = await SessionsCollection.create(newSession);
//   console.log('Новая сессия с данными:', newSessionData);

//   return newSessionData;
// };

export const refreshSession = async (oldRefreshToken) => {
  try {
    jwt.verify(oldRefreshToken, REFRESH_SECRET_KEY);
    const { id } = jwt.decode(oldRefreshToken);

    const user = await UserCollection.findById(id);
    if (!user) {
      throw HttpError(404, 'User not found');
    }

    const payload = { id: user._id };
    const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    const newRefreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: '30d',
    });

    await UserCollection.findByIdAndUpdate(user._id, {
      token: newToken,
      refreshToken: newRefreshToken,
    });

    return { token: newToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw error;
  }
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
