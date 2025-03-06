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

router.get(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(userController),
);
router.get('/login', ctrlWrapper(loginController));
router.get('/logout', ctrlWrapper(logoutUserController));
router.get('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
