import { Router } from 'express';
import auth from './authRoute.js';

const router = Router();

router.use('/users', auth);

export default router;
