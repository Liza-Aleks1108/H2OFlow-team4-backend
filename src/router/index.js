import { Router } from 'express';
import auth from './authRoute.js';
import countUser from './countUser.js';
import resetEmail from './resetEmail.js';
import user from './user.js';
import water from './water.js';

const router = Router();
router.use('/users', countUser);
router.use('/users', user);
router.use('/users', auth);
router.use('/auth', resetEmail);
router.use('/water', water);

export default router;
