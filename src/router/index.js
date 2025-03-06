import { Router } from 'express';
import auth from './authRoute.js';

const router = Router();

router.use('/', auth);

export default router;
