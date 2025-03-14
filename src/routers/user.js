import { Router } from 'express';
import {
  getUserController,
  updateUserAvatarController,
  updateUserController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validationUpdateUserSchema } from '../validation/authValidation.js';

const router = Router();

router.patch(
  '/',
  authenticate,
  validateBody(validationUpdateUserSchema),
  ctrlWrapper(updateUserController),
);
router.patch(
  '/avatar',
  authenticate,
  upload.single('photo'),
  ctrlWrapper(updateUserAvatarController),
);
router.get('/', authenticate, ctrlWrapper(getUserController));

export default router;
