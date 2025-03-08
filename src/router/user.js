import { Router } from 'express';
import {
  getUserController,
  updateUserController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validationUpdateUserSchema } from '../validation/authValidation.js';

const user = Router();

user.patch(
  '/update',
  authenticate,
  validateBody(validationUpdateUserSchema),
  ctrlWrapper(updateUserController),
);

user.get('/:userId', authenticate, ctrlWrapper(getUserController));

export default user;
