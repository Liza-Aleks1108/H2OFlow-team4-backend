import {
  login,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
} from '../services/auth.js';

import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ONE_DAY } from '../constants/index.js';
import { UserCollection } from '../dB/user.js';
import { updateUser } from '../services/users.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getUsersCountController = async (req, res, next) => {
  try {
    const userCount = await UserCollection.countDocuments();

    return res.status(200).json({
      message: 'Total number of users',
      count: userCount,
    });
  } catch (error) {
    next(error);
  }
};

// регистрация пользователя
export const userController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserCollection({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User successfully registered!',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// логин пользователя
export const loginController = async (req, res) => {
  const session = await login(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { email } = req.body;
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.json({
    status: 204,
    message: `Successfully logged out! ${email}`,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const updateUserController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const payload = req.body;
    const updatedUser = await updateUser(userId, payload);

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }
    return res.status(200).json({
      message: 'User successfully updated!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    let { usertId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(usertId)) {
      return next(createHttpError(400, 'Invalid contactId format'));
    }

    usertId = new mongoose.Types.ObjectId(usertId);

    const user = await UserCollection.findById(usertId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return res.status(200).json({
      message: 'User successfully found!',
      user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//Сброс пароля через Email
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(createHttpError(400, 'Token and password are required'));
  }

  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await UserCollection.findOne({ email: decoded.email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).send('Password reset successfully');
  } catch (error) {
    return next(createHttpError(400, 'Invalid or expired token'));
  }
};

export const resetPasswordPageController = (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(createHttpError(400, 'Token is required'));
  }

  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    res.status(200).send(`
      <html>
        <body>
          <h1>Reset your password</h1>
          <form action="/reset-password" method="POST">
            <input type="hidden" name="token" value="${token}" />
            <label for="password">New Password:</label>
            <input type="password" id="password" name="password" required />
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);
  } catch (error) {
    return next(createHttpError(400, 'Invalid or expired token'));
  }
};
