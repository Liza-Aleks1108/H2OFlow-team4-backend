import { Router } from 'express';
import multer from 'multer';
import {
  requestResetEmailController,
  resetPasswordController,
  resetPasswordPageController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { requestResetEmailSchema } from '../validation/authValidation.js';

const router = Router();

router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.get('/reset-password', resetPasswordPageController);

router.post('/reset-password', multer().none(), resetPasswordController);

export default router;
