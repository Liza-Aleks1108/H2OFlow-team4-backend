import { Router } from 'express';
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
router.post('/reset-password', resetPasswordController);
router.get('/reset-password', resetPasswordPageController);

export default router;
