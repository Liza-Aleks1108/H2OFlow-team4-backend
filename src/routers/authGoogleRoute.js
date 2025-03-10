import { Router } from 'express';
import {
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginWithGoogleOAuthSchema } from '../validation/authValidation.js';

const router = Router();
router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;
