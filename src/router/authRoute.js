import { Router } from 'express';
import {
  loginController,
  logoutUserController,
  refreshUserSessionController,
  userController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/authValidation.js';

const router = Router();

// POST /auth/register
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(userController),
);
router.post('/login', ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
