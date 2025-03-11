import { Router } from 'express';
import {
  getUserController,
  updateUserController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validationUpdateUserSchema } from '../validation/authValidation.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.use(authenticate);

router.patch(
  '/update',
  validateBody(validationUpdateUserSchema),
  upload.single('photo'),
  ctrlWrapper(updateUserController),
);

router.get('/:userId', ctrlWrapper(getUserController));

export default router;
