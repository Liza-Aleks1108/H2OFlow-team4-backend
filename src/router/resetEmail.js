import { Router } from 'express';
import {
  requestResetEmailController,
  resetPasswordController,
  resetPasswordPageController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { requestResetEmailSchema } from '../validation/authValidation.js';

const resetEmail = Router();

resetEmail.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
resetEmail.post('/reset-password', resetPasswordController);
resetEmail.get('/reset-password', resetPasswordPageController);

export default resetEmail;
