import {
  // login,
  loginUser,
  // loginOrSignupWithGoogle,
  logoutUser,
  // refreshUsersSession,
  registerUser,
  requestResetToken,
  refreshSession,
  loginOrSignupWithGoogle,
} from '../services/auth.js';

import bcrypt from 'bcryptjs';
import createHttpError, { HttpError } from 'http-errors';
import jwt from 'jsonwebtoken';
// import { ONE_DAY } from '../constants/index.js';
import { UserCollection } from '../dB/user.js';
import { updateUser } from '../services/users.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { ONE_DAY } from '../constants/index.js';

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

// // логин пользователя
// export const loginController = async (req, res) => {
//   const session = await login(req.body);
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//     path: '/',
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY),
//     path: '/',
//   });

//   res.json({
//     status: 200,
//     message: 'Successfully logged in an user!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUser(email, password);

    res.json({
      user,
      token,
      refreshToken,
      message: `Welcome back, ${user.name} to the AquaTrack!`,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res) => {
  const { email } = req.body;
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  res.json({
    status: 204,
    message: `Successfully logged out! ${email}`,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: false,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: false,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('accessToken', session.accessToken, {
    httpOnly: false,
    expires: new Date(Date.now() + ONE_DAY),
    path: '/',
  });
};

// export const refreshUserSessionController = async (req, res) => {
//   const session = await refreshUsersSession({
//     sessionId: req.cookies.sessionId,
//     refreshToken: req.cookies.refreshToken,
//   });

//   setupSession(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return next(HttpError(400, 'Refresh token is required'));
    }

    const { token, refreshToken } = await refreshSession(oldRefreshToken);

    res.json({ token, refreshToken });
  } catch (error) {
    next(error);
  }
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

export const updateUserAvatarController = async (req, res, next) => {
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
      avatarUrl: photoUrl,
      // user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    let userId = req.user._id;

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

    res.status(200).json({
      status: 200,
      message: 'Password reset successfully',
    });
  } catch {
    return next(createHttpError(400, 'Invalid or expired token'));
  }
};

export const resetPasswordPageController = (req, res, next) => {
  const { token } = req.query;
  console.log('TOKEN', token);
  if (!token) {
    return next(createHttpError(400, 'Token is required'));
  }

  try {
    jwt.verify(token, getEnvVar('JWT_SECRET'));

    res.status(200).json({ status: 200, message: 'Form change password' });

    //
    // send(`
    //   <html>
    //     <body>
    //       <h1>Reset your password</h1>
    //       <form action="/auth/reset-password" method="POST">
    //         <input type="hidden" name="token" value="${token}" />
    //         <label for="password">New Password:</label>
    //         <input type="password" id="password" name="password" required />
    //         <button type="submit">Reset Password</button>
    //       </form>
    //     </body>
    //   </html>
    // `);
  } catch {
    return next(createHttpError(400, 'Invalid or expired token'));
  }
};

// Google валидация
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
