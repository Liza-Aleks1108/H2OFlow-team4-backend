import {
  login,
  logoutUser,
  refreshUsersSession,
  registerUser,
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
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
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
    const photo = req.file;

    let photoUrl;

    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const updatedUser = await updateUser(userId, {
      ...req.body,
      avatarUrl: photoUrl,
    });

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
    let { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createHttpError(400, 'Invalid contactId format'));
    }

    userId = new mongoose.Types.ObjectId(userId);

    const user = await UserCollection.findById(userId);

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
